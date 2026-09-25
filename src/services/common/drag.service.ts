class DragService {
  /**
   * Makes a `position: fixed` element draggable with mouse, touch or pen.
   * Pointer capture keeps the drag going even when the pointer leaves the element,
   * and the element is always kept inside the viewport.
   * Drags never start on buttons, so their clicks keep working.
   */
  public makeElementDraggable(element: HTMLElement, onDragEndCallback?: (x: string, y: string) => void) {
    element.addEventListener('pointerdown', (event: PointerEvent) => {
      if (event.button !== 0 || (event.target as Element).closest('button')) {
        return;
      }
      event.preventDefault();

      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      element.setPointerCapture(event.pointerId);

      const onPointerMove = (moveEvent: PointerEvent) => {
        this.moveElementTo(element, moveEvent.clientX - offsetX, moveEvent.clientY - offsetY);
      };

      const onPointerUp = () => {
        element.releasePointerCapture(event.pointerId);
        element.removeEventListener('pointermove', onPointerMove);
        element.removeEventListener('pointerup', onPointerUp);
        element.removeEventListener('pointercancel', onPointerUp);

        if (onDragEndCallback) {
          onDragEndCallback(element.style.left, element.style.top);
        }
      };

      element.addEventListener('pointermove', onPointerMove);
      element.addEventListener('pointerup', onPointerUp);
      element.addEventListener('pointercancel', onPointerUp);
    });
  }

  /**
   * Pulls an element that was dragged before back inside the viewport,
   * e.g. after it grew or the window shrank
   */
  public keepElementInViewport(element: HTMLElement) {
    if (element.style.left) {
      const rect = element.getBoundingClientRect();
      this.moveElementTo(element, rect.left, rect.top);
    }
  }

  private moveElementTo(element: HTMLElement, x: number, y: number) {
    const maxX = Math.max(0, window.innerWidth - element.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - element.offsetHeight);

    element.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
    element.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
    element.style.right = 'auto';
    element.style.bottom = 'auto';
  }
}

export default new DragService();
