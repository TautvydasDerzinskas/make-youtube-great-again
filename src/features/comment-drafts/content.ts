import commentDraftsService, { ICommentDraft } from './services/comment-drafts.service';
import commentBoxService, { COMMENT_BOX } from './services/comment-box.service';
import urlService from '../../services/common/url.service';

import IContent from '../../interfaces/content';
import { ACCOUNT_REQUEST_EVENT, ACCOUNT_RESPONSE_EVENT, IAccount, IAccountResponse } from './comment-drafts.events';

import './styles/comment-drafts.scss';

const DRAFT_BUTTON_CLASS = 'myga-draft-btn';
const DRAFTS_LIST_CLASS = 'myga-comment-drafts';
const DEFAULT_AVATAR_URL = 'https://yt3.ggpht.com/a/default-user=s88-c-k-c0x00ffffff-no-rj';

// YouTube™'s button classes, so they match its look & theme
const BUTTON_CLASSES = {
  filled: 'ytSpecButtonShapeNextHost ytSpecButtonShapeNextFilled ytSpecButtonShapeNextCallToAction ytSpecButtonShapeNextSizeS',
  text: 'ytSpecButtonShapeNextHost ytSpecButtonShapeNextText ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeS',
};

class ContentCommentDrafts implements IContent {
  private drafts: ICommentDraft[] = [];
  private pageObserver: MutationObserver;
  private removeStorageListener: () => void;
  private isUpdateScheduled = false;
  private editingDraftId: string = null;
  private publishingDraftId: string = null;
  private errors = new Map<string, string>();
  private watchedCommentBoxes = new WeakSet<Element>();
  private account: IAccount = null;
  private isAccountRequested = false;

  get videoId() {
    return urlService.getQueryParameterByName('v');
  }

  public extendPageUserInterface() {
    this.removeUserInterface();
    this.editingDraftId = null;
    this.errors.clear();

    // The comments section loads late & YouTube™ re-renders it
    this.pageObserver = new MutationObserver(() => this.scheduleUpdate());
    this.pageObserver.observe(document.querySelector('ytd-watch-flexy') || document.body, { childList: true, subtree: true });

    if (!this.removeStorageListener) {
      this.removeStorageListener = commentDraftsService.onChange(() => this.loadDrafts());
    }

    this.requestAccount();
    this.loadDrafts().then(() => this.publishRequestedDraft());
  }

  /**
   * Shown as the drafts' author, like on real comments. Asked once: it doesn't change without a page reload.
   */
  private requestAccount() {
    if (this.isAccountRequested) {
      return;
    }
    this.isAccountRequested = true;

    const onResponse = (event: CustomEvent<string>) => {
      document.removeEventListener(ACCOUNT_RESPONSE_EVENT, onResponse);
      const response: IAccountResponse = JSON.parse(event.detail);
      this.account = response.account;
      this.renderDraftsList(true);
    };
    document.addEventListener(ACCOUNT_RESPONSE_EVENT, onResponse);
    document.dispatchEvent(new CustomEvent(ACCOUNT_REQUEST_EVENT));
  }

  /**
   * Signed out (or before the account loads): the avatar YouTube™ shows next to "Add a comment..."
   */
  private get author() {
    const commentBoxAvatar = document.querySelector<HTMLImageElement>('ytd-comments-header-renderer #simple-box #author-thumbnail img');
    return {
      name: this.account && (this.account.handle || this.account.name) || 'You',
      handle: this.account && this.account.handle,
      avatarUrl: this.account && this.account.avatarUrl || commentBoxAvatar && commentBoxAvatar.src || DEFAULT_AVATAR_URL,
    };
  }

  public cleanUp() {
    this.removeUserInterface();

    if (this.removeStorageListener) {
      this.removeStorageListener();
      this.removeStorageListener = null;
    }
  }

  private removeUserInterface() {
    if (this.pageObserver) {
      this.pageObserver.disconnect();
      this.pageObserver = null;
    }
    document.querySelectorAll(`.${DRAFT_BUTTON_CLASS}, .${DRAFTS_LIST_CLASS}`).forEach(element => element.remove());
  }

  private async loadDrafts() {
    this.drafts = await commentDraftsService.getForVideo(this.videoId);
    this.renderDraftsList(true);
  }

  /**
   * Set when "Publish" was clicked in the popup, which opened this video
   */
  private async publishRequestedDraft() {
    const draft = await commentDraftsService.takePublishRequest(this.videoId);
    if (draft) {
      this.publish(draft);
    }
  }

  private scheduleUpdate() {
    if (this.isUpdateScheduled) {
      return;
    }
    this.isUpdateScheduled = true;
    requestAnimationFrame(() => {
      this.isUpdateScheduled = false;
      this.insertDraftButtons();
      this.renderDraftsList(false);
    });
  }

  /**
   * "Create a Draft" between YouTube™'s "Cancel" & "Comment"
   */
  private insertDraftButtons() {
    document.querySelectorAll(COMMENT_BOX).forEach(commentBox => {
      const buttons = commentBox.querySelector('#buttons');
      if (!buttons || buttons.querySelector(`.${DRAFT_BUTTON_CLASS}`)) {
        return;
      }

      const $button = this.createButton('Create a Draft', 'text', () => this.createDraft(commentBox));
      $button.classList.add(DRAFT_BUTTON_CLASS);

      const submitButton = buttons.querySelector('#submit-button');
      buttons.insertBefore($button, submitButton && submitButton.parentElement === buttons ? submitButton : null);

      // Enabled only when there's text, like YouTube™'s own "Comment"
      const updateDisabled = () => {
        const draftButton = commentBox.querySelector<HTMLButtonElement>(`.${DRAFT_BUTTON_CLASS}`);
        if (draftButton) {
          draftButton.disabled = commentBoxService.getText(commentBox) === '';
        }
      };
      if (!this.watchedCommentBoxes.has(commentBox)) {
        this.watchedCommentBoxes.add(commentBox);
        commentBox.addEventListener('input', updateDisabled);
      }
      updateDisabled();
    });
  }

  private async createDraft(commentBox: Element) {
    const text = commentBoxService.getText(commentBox);
    if (!text) {
      return;
    }

    await commentDraftsService.add(this.videoId, this.videoTitle, text);
    commentBoxService.cancel(commentBox);
  }

  private get videoTitle() {
    const title = document.querySelector('ytd-watch-metadata #title h1');
    return title && title.textContent.trim() || document.title.replace(/ - YouTube$/, '');
  }

  /**
   * Above the comments, below YouTube™'s comment box
   */
  private renderDraftsList(force: boolean) {
    const comments = document.querySelector('ytd-comments #sections > #contents');
    if (!comments) {
      return;
    }

    let list = comments.previousElementSibling;
    const isInPlace = list && list.classList.contains(DRAFTS_LIST_CLASS);
    if (isInPlace && !force) {
      return;
    }

    if (!isInPlace) {
      document.querySelectorAll(`.${DRAFTS_LIST_CLASS}`).forEach(staleList => staleList.remove());
      list = document.createElement('div');
      list.className = DRAFTS_LIST_CLASS;
      comments.before(list);
    }

    list.replaceChildren(...this.drafts.map(draft => this.createDraftCard(draft)));
  }

  /**
   * Shaped like YouTube™'s own comments: avatar, author & time, text, toolbar
   */
  private createDraftCard(draft: ICommentDraft) {
    const card = document.createElement('div');
    card.className = 'myga-comment-draft';

    const author = this.author;
    const avatar = document.createElement('img');
    avatar.className = 'myga-comment-draft__avatar';
    avatar.src = author.avatarUrl;
    avatar.alt = '';

    const main = document.createElement('div');
    main.className = 'myga-comment-draft__main';

    const meta = document.createElement('div');
    meta.className = 'myga-comment-draft__meta';
    const authorName = document.createElement(author.handle ? 'a' : 'span');
    authorName.className = 'myga-comment-draft__author';
    authorName.textContent = author.name;
    if (author.handle) {
      (authorName as HTMLAnchorElement).href = `/${author.handle}`;
    }
    const badge = document.createElement('span');
    badge.className = 'myga-comment-draft__badge';
    badge.textContent = 'Draft';
    const age = document.createElement('span');
    age.className = 'myga-comment-draft__age';
    age.textContent = `saved ${commentDraftsService.formatAge(draft.updatedAt)}`;
    meta.append(authorName, badge, age);

    const actions = document.createElement('div');
    actions.className = 'myga-comment-draft__actions';

    let body: HTMLElement;
    if (this.editingDraftId === draft.id) {
      const textarea = document.createElement('textarea');
      textarea.className = 'myga-comment-draft__editor';
      textarea.value = draft.text;
      textarea.rows = Math.min(10, Math.max(3, draft.text.split('\n').length + 1));
      body = textarea;

      actions.append(
        this.createButton('Save', 'filled', async () => {
          const text = textarea.value.trim();
          if (text) {
            this.editingDraftId = null;
            await commentDraftsService.update(draft.id, text);
          }
        }),
        this.createButton('Cancel', 'text', () => {
          this.editingDraftId = null;
          this.renderDraftsList(true);
        }),
      );
      requestAnimationFrame(() => textarea.focus());
    } else {
      body = document.createElement('div');
      body.className = 'myga-comment-draft__text';
      body.textContent = draft.text;

      const isPublishing = this.publishingDraftId === draft.id;
      const publishButton = this.createButton(isPublishing ? 'Publishing…' : 'Publish', 'filled', () => this.publish(draft));
      publishButton.disabled = Boolean(this.publishingDraftId);

      const editButton = this.createButton('Edit', 'text', () => {
        this.editingDraftId = draft.id;
        this.renderDraftsList(true);
      });
      editButton.disabled = isPublishing;

      const deleteButton = this.createButton('Delete', 'text', () => {
        if (confirm('Delete this draft comment?')) {
          commentDraftsService.remove(draft.id);
        }
      });
      deleteButton.disabled = isPublishing;

      actions.append(publishButton, editButton, deleteButton);
    }

    main.append(meta, body);

    const error = this.errors.get(draft.id);
    if (error) {
      const errorElement = document.createElement('div');
      errorElement.className = 'myga-comment-draft__error';
      errorElement.textContent = `Not published: ${error}`;
      main.append(errorElement);
    }

    main.append(actions);
    card.append(avatar, main);
    return card;
  }

  private async publish(draft: ICommentDraft) {
    if (this.publishingDraftId) {
      return;
    }

    this.publishingDraftId = draft.id;
    this.errors.delete(draft.id);
    this.renderDraftsList(true);

    try {
      await commentBoxService.publish(draft.text);
      // Only removed once YouTube™ confirmed it, so nothing gets lost
      await commentDraftsService.remove(draft.id);
    } catch (error) {
      this.errors.set(draft.id, error.message);
    } finally {
      this.publishingDraftId = null;
      this.renderDraftsList(true);
    }
  }

  private createButton(label: string, variant: 'filled' | 'text', onClick: () => void) {
    const $button = document.createElement('button');
    $button.type = 'button';
    $button.className = `myga-comment-draft-btn ${BUTTON_CLASSES[variant]}`;

    const text = document.createElement('div');
    text.className = 'ytSpecButtonShapeNextButtonTextContent';
    text.textContent = label;
    $button.append(text);

    $button.addEventListener('click', (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    });
    return $button;
  }
}

export default new ContentCommentDrafts();
