/**
 * YouTube™'s top level comment box (not the reply boxes under comments),
 * rendered only once the "Add a comment..." placeholder is clicked
 */
export const COMMENT_BOX = 'ytd-comments ytd-comments-header-renderer ytd-commentbox';
const COMMENT_BOX_PLACEHOLDER = 'ytd-comments ytd-comments-header-renderer #simple-box #placeholder-area';

const SIGNED_OUT_MESSAGE = 'Sign in to YouTube™ to publish comments';
const WAIT_TIMEOUT = 20000;
const WAIT_INTERVAL = 250;

class CommentBoxService {
  public getEditor(commentBox: Element) {
    return commentBox.querySelector<HTMLElement>('#contenteditable-root');
  }

  public getText(commentBox: Element) {
    const editor = this.getEditor(commentBox);
    return editor ? editor.innerText.trim() : '';
  }

  /**
   * YouTube™'s own "Cancel": clears & collapses the box
   */
  public cancel(commentBox: Element) {
    this.click(commentBox.querySelector('#cancel-button'));
  }

  /**
   * Types the text into YouTube™'s comment box & submits it, as the user would.
   * Resolves once YouTube™ clears the box, which it does after posting.
   */
  public async publish(text: string) {
    // Signed out, YouTube™ shows a "Sign in" link in the top bar
    if (document.querySelector('ytd-masthead #buttons a[href*="accounts.google.com/ServiceLogin"]')) {
      throw new Error(SIGNED_OUT_MESSAGE);
    }

    const comments = await this.waitFor(() => document.querySelector('ytd-comments'), 'Comments section not found');
    comments.scrollIntoView({ block: 'start' });

    let commentBox = this.visibleCommentBox;
    if (!commentBox) {
      const placeholder = await this.waitFor(
        () => document.querySelector<HTMLElement>(COMMENT_BOX_PLACEHOLDER),
        'Comments are turned off or not loaded',
      );
      placeholder.click();
      // Signed out users get a sign in prompt instead of the box
      commentBox = await this.waitFor(() => this.visibleCommentBox, SIGNED_OUT_MESSAGE);
    }

    const editor = await this.waitFor(() => this.getEditor(commentBox), 'Comment box not found');
    editor.focus();
    document.execCommand('selectAll', false);
    // Goes through YouTube™'s own input handling, so its "Comment" button enables
    document.execCommand('insertText', false, text);
    if (editor.innerText.trim() !== text.trim()) {
      editor.textContent = text;
      editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }

    const submitButton = await this.waitFor(() => {
      const button = commentBox.querySelector<HTMLElement>('#submit-button button') || commentBox.querySelector<HTMLElement>('#submit-button');
      return button && !button.hasAttribute('disabled') && button.getAttribute('aria-disabled') !== 'true' ? button : null;
    }, 'YouTube™ didn\'t accept the comment text');
    submitButton.click();

    await this.waitFor(
      () => !editor.isConnected || editor.innerText.trim() === '',
      'YouTube™ didn\'t confirm the comment was posted',
    );
  }

  private get visibleCommentBox() {
    const commentBox = document.querySelector<HTMLElement>(COMMENT_BOX);
    return commentBox && commentBox.offsetParent !== null ? commentBox : null;
  }

  private click(element: Element) {
    const target = element && (element.querySelector('button') || element);
    if (target) {
      (target as HTMLElement).click();
    }
  }

  private waitFor<T>(check: () => T, errorMessage: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
      const poll = () => {
        const result = check();
        if (result) {
          resolve(result);
        } else if (Date.now() - startedAt > WAIT_TIMEOUT) {
          reject(new Error(errorMessage));
        } else {
          setTimeout(poll, WAIT_INTERVAL);
        }
      };
      poll();
    });
  }
}

export default new CommentBoxService();
