class DragService {
  public makeElementDraggable(element: HTMLElement) {
    let initX = 0;
    let initY = 0;
    let firstX = 0;
    let firstY = 0;

    element.addEventListener('mousedown', function (e: MouseEvent) {
      e.preventDefault();

      initX = this.offsetLeft;
      initY = this.offsetTop;
      firstX = e.pageX;
      firstY = e.pageY;

      this.addEventListener('mousemove', dragIt, false);

      window.addEventListener('mouseup', () => {
        element.removeEventListener('mousemove', dragIt, false);
      }, false);

    }, false);

    element.addEventListener('touchstart', function (e: TouchEvent) {
      e.preventDefault();

      initX = this.offsetLeft;
      initY = this.offsetTop;
      const touch = e.touches;
      firstX = touch[0].pageX;
      firstY = touch[0].pageY;

      this.addEventListener('touchmove', swipeIt, false);

      window.addEventListener('touchend', (event: TouchEvent) => {
        event.preventDefault();
        element.removeEventListener('touchmove', swipeIt, false);
      }, false);

    }, false);

    function dragIt(e: MouseEvent) {
      this.style.left = initX + e.pageX - firstX + 'px';
      this.style.top = initY + e.pageY - firstY + 'px';
    }

    function swipeIt(e: TouchEvent) {
      const contact = e.touches;
      this.style.left = initX + contact[0].pageX - firstX + 'px';
      this.style.top = initY + contact[0].pageY - firstY + 'px';
    }
  }
}

export default new DragService();
