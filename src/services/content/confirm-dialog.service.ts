import './confirm-dialog.scss';

interface IConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
}

// YouTube™'s button classes, so they match its look & theme
const BUTTON_CLASSES = {
  filled: 'ytSpecButtonShapeNextHost ytSpecButtonShapeNextFilled ytSpecButtonShapeNextCallToAction ytSpecButtonShapeNextSizeM',
  text: 'ytSpecButtonShapeNextHost ytSpecButtonShapeNextText ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM',
};

/**
 * A confirmation dialog looking like YouTube™'s own ones (light & dark theme).
 * Resolves with whether it was confirmed: Esc, Cancel or a click outside cancel.
 */
class ConfirmDialogService {
  public confirm({ title, message, confirmLabel }: IConfirmOptions): Promise<boolean> {
    document.querySelectorAll('.myga-confirm').forEach(dialog => dialog.remove());
    const previouslyFocused = document.activeElement as HTMLElement;

    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'myga-confirm';

      const dialog = document.createElement('div');
      dialog.className = 'myga-confirm__dialog';
      dialog.setAttribute('role', 'alertdialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'myga-confirm-title');
      dialog.setAttribute('aria-describedby', 'myga-confirm-message');

      const heading = document.createElement('h2');
      heading.id = 'myga-confirm-title';
      heading.className = 'myga-confirm__title';
      heading.textContent = title;

      const text = document.createElement('p');
      text.id = 'myga-confirm-message';
      text.className = 'myga-confirm__message';
      text.textContent = message;

      const actions = document.createElement('div');
      actions.className = 'myga-confirm__actions';
      const cancelButton = this.createButton('Cancel', 'text');
      const confirmButton = this.createButton(confirmLabel, 'filled');
      actions.append(cancelButton, confirmButton);

      dialog.append(heading, text, actions);
      overlay.append(dialog);

      const close = (confirmed: boolean) => {
        document.removeEventListener('keydown', onKeyDown, true);
        overlay.remove();
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus();
        }
        resolve(confirmed);
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          close(false);
        }
      };

      cancelButton.addEventListener('click', () => close(false));
      confirmButton.addEventListener('click', () => close(true));
      overlay.addEventListener('click', (event: MouseEvent) => {
        if (event.target === overlay) {
          close(false);
        }
      });
      document.addEventListener('keydown', onKeyDown, true);

      document.body.append(overlay);
      // Cancel focused: Enter doesn't confirm by accident
      cancelButton.focus();
    });
  }

  private createButton(label: string, variant: 'filled' | 'text') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `myga-confirm__button ${BUTTON_CLASSES[variant]}`;
    const text = document.createElement('div');
    text.className = 'ytSpecButtonShapeNextButtonTextContent';
    text.textContent = label;
    button.append(text);
    return button;
  }
}

export default new ConfirmDialogService();
