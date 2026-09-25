import './tooltip.scss';

const TOOLTIP_ATTRIBUTE = 'data-myga-tooltip';
const TOOLTIP_ID = 'myga-tooltip';
// Same spacing as YouTube™'s own tooltips under its buttons
const GAP = 16;
const EDGE_MARGIN = 8;

/**
 * Tooltips looking like YouTube™'s own (its are positioned by its scripts, which our buttons can't use).
 * Replaces the browser's plain "title" tooltip. The text is read on each hover, so it can change.
 */
class TooltipService {
  private hideTooltip = () => this.hide();
  private showFrame: number;

  public attach(element: HTMLElement, text: string) {
    this.setText(element, text);
    element.removeAttribute('title');

    if (element.hasAttribute('data-myga-tooltip-attached')) {
      return;
    }
    element.setAttribute('data-myga-tooltip-attached', '');
    element.addEventListener('mouseenter', () => this.show(element));
    // Keyboard focus only: a click focuses the button too, and would bring the tooltip back after hiding it
    element.addEventListener('focus', () => {
      if (element.matches(':focus-visible')) {
        this.show(element);
      }
    });
    element.addEventListener('mouseleave', this.hideTooltip);
    element.addEventListener('blur', this.hideTooltip);
    element.addEventListener('click', this.hideTooltip);
  }

  public setText(element: HTMLElement, text: string) {
    element.setAttribute(TOOLTIP_ATTRIBUTE, text);

    // Hovered right now: update it in place
    const tooltip = document.getElementById(TOOLTIP_ID);
    if (tooltip && tooltip.dataset.for === this.elementKey(element)) {
      tooltip.textContent = text;
    }
  }

  private show(element: HTMLElement) {
    const text = element.getAttribute(TOOLTIP_ATTRIBUTE);
    if (!text) {
      return;
    }

    let tooltip = document.getElementById(TOOLTIP_ID);
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = TOOLTIP_ID;
      tooltip.setAttribute('role', 'tooltip');
      document.body.append(tooltip);
      window.addEventListener('scroll', this.hideTooltip, { capture: true, passive: true });
    }

    tooltip.textContent = text;
    tooltip.dataset.for = this.elementKey(element);
    tooltip.classList.remove('myga-tooltip--visible');

    // Centred under the element, kept inside the window, above it when there's no room below
    const target = element.getBoundingClientRect();
    const size = tooltip.getBoundingClientRect();
    const left = Math.min(
      Math.max(EDGE_MARGIN, target.left + target.width / 2 - size.width / 2),
      window.innerWidth - size.width - EDGE_MARGIN,
    );
    const below = target.bottom + GAP;
    const top = below + size.height > window.innerHeight - EDGE_MARGIN ? target.top - GAP - size.height : below;

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
    cancelAnimationFrame(this.showFrame);
    this.showFrame = requestAnimationFrame(() => tooltip.classList.add('myga-tooltip--visible'));
  }

  private hide() {
    // A fade in still pending would show it again right after
    cancelAnimationFrame(this.showFrame);
    const tooltip = document.getElementById(TOOLTIP_ID);
    if (tooltip) {
      tooltip.classList.remove('myga-tooltip--visible');
      delete tooltip.dataset.for;
    }
  }

  private elementKey(element: HTMLElement) {
    if (!element.dataset.mygaTooltipKey) {
      element.dataset.mygaTooltipKey = crypto.randomUUID();
    }
    return element.dataset.mygaTooltipKey;
  }
}

export default new TooltipService();
