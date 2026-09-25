import tooltipService from './tooltip.service';

const ACTION_ROW_CLASS = 'myga-action-row';

/**
 * Extension's buttons under the video, in a row of their own below YouTube™'s action buttons
 */
class ActionButtonService {
  private alignmentObserver: ResizeObserver;

  /**
   * Same classes as YouTube™'s own buttons in that row, so it matches their look & theme.
   * The tooltip says what a click does, so an on / off button can have one for each state.
   */
  public create(className: string, label: string, icon: string, tooltip: string, activeTooltip = tooltip) {
    const $button = document.createElement('button');
    $button.className = `myga-action-btn ${className} ytSpecButtonShapeNextHost ytSpecButtonShapeNextTonal ytSpecButtonShapeNextMono ytSpecButtonShapeNextSizeM ytSpecButtonShapeNextIconLeading`;
    $button.setAttribute('aria-label', label);
    $button.setAttribute('aria-pressed', 'false');
    $button.setAttribute('type', 'button');
    $button.innerHTML = `
      <div class="ytSpecButtonShapeNextIcon">${icon}</div>
      <div class="ytSpecButtonShapeNextButtonTextContent">${label}</div>
    `;
    $button.dataset.mygaTooltipInactive = tooltip;
    $button.dataset.mygaTooltipActive = activeTooltip;
    tooltipService.attach($button, tooltip);

    return $button;
  }

  public setActive($button: HTMLElement, isActive: boolean) {
    $button.classList.toggle('myga-action-btn--active', isActive);
    $button.setAttribute('aria-pressed', String(isActive));
    tooltipService.setText($button, isActive ? $button.dataset.mygaTooltipActive : $button.dataset.mygaTooltipInactive);
  }

  /**
   * Adds the button to our own row under YouTube™'s action buttons & keeps it there,
   * as YouTube™ re-renders that area (e.g. when the window is resized).
   * Not in YouTube™'s own row: it only fits so many buttons and would hide "Save" to make room.
   * Disconnect the returned observer when removing the button.
   */
  public attach($button: HTMLElement): MutationObserver {
    const insert = () => {
      const row = this.getOrCreateRow();
      if (row && $button.parentElement !== row) {
        row.appendChild($button);
      }
    };
    insert();

    const aboveTheFold = document.querySelector('ytd-watch-metadata #above-the-fold');
    if (!aboveTheFold) {
      return null;
    }

    const observer = new MutationObserver(insert);
    observer.observe(aboveTheFold, { childList: true, subtree: true });
    return observer;
  }

  private getOrCreateRow() {
    const topRow = document.querySelector('ytd-watch-metadata #top-row');
    if (!topRow) {
      return null;
    }

    let row = topRow.nextElementSibling;
    if (!row || !row.classList.contains(ACTION_ROW_CLASS)) {
      document.querySelectorAll(`.${ACTION_ROW_CLASS}`).forEach(staleRow => staleRow.remove());
      row = document.createElement('div');
      row.className = ACTION_ROW_CLASS;
      topRow.after(row);
      this.followActionsAlignment(topRow, row);
    }

    return row;
  }

  /**
   * On narrow pages YouTube™ wraps its buttons under the channel name, on the left
   */
  private followActionsAlignment(topRow: Element, row: Element) {
    const align = () => {
      const actions = topRow.querySelector('#actions');
      const isWrapped = actions && actions.getBoundingClientRect().left - topRow.getBoundingClientRect().left < 20;
      row.classList.toggle(`${ACTION_ROW_CLASS}--start`, Boolean(isWrapped));
    };
    align();

    if (this.alignmentObserver) {
      this.alignmentObserver.disconnect();
    }
    this.alignmentObserver = new ResizeObserver(align);
    this.alignmentObserver.observe(topRow);
  }
}

export default new ActionButtonService();
