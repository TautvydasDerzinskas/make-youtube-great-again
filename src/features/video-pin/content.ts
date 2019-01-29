import './styles/video-pin.scss';

import IContent from '../../interfaces/content';

class ContentVideoPin implements IContent {
  private isVideoPinned = false;
  private videoScrollBreakpoint: number;


  public extendPageUserInterface() {
    const videoPinElement = document.createElement('div');
    videoPinElement.className = 'pinned-video';
    document.body.appendChild(videoPinElement);
  }

  setupEventListeners() {
    this.enableDragging();
    this.timerChecker();

    const videoContainerY = document.querySelector('.html5-video-container > *').getBoundingClientRect().top;
    const videoHeight = document.querySelector('.video-stream').clientHeight;
    this.videoScrollBreakpoint = videoContainerY + videoHeight;

    let originalVideoHeight = 0;
    let originalVideoWidth = 0;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;

      if (scrolled >= this.videoScrollBreakpoint && !this.isVideoPinned) {
        document.getElementsByClassName('pinned-video')[0]
          .classList.add('pinned-video--active');

        const videoPinElement = document.getElementsByClassName('pinned-video')[0];
        const realVideoElement = document.getElementsByClassName('video-stream')[0];

        originalVideoHeight = realVideoElement.clientHeight;
        originalVideoWidth = realVideoElement.clientWidth;

        (realVideoElement as HTMLElement).style.height = '175px';
        (realVideoElement as HTMLElement).style.width = '310px';

        videoPinElement.appendChild(realVideoElement);

        this.isVideoPinned = true;
      } else if (scrolled < this.videoScrollBreakpoint && this.isVideoPinned) {
        document.getElementsByClassName('pinned-video')[0]
          .classList.remove('pinned-video--active');


        const realVideoContainer = document.getElementsByClassName('html5-video-container')[0];
        const realVideoElement = document.getElementsByClassName('video-stream')[0];

        (realVideoElement as HTMLElement).style.height = originalVideoHeight + 'px';
        (realVideoElement as HTMLElement).style.width = originalVideoWidth + 'px';

        realVideoContainer.appendChild(realVideoElement);

        this.isVideoPinned = false;
      }
    });
  }

  public cleanUp() {
  }

  private enableDragging() {
    const object = document.getElementsByClassName('pinned-video')[0];
    let initX = 0;
    let initY = 0;
    let firstX = 0;
    let firstY = 0;

    object.addEventListener('mousedown', function (e: any) {
      e.preventDefault();

      initX = this.offsetLeft;
      initY = this.offsetTop;
      firstX = e.pageX;
      firstY = e.pageY;

      this.addEventListener('mousemove', dragIt, false);

      window.addEventListener('mouseup', function () {
        object.removeEventListener('mousemove', dragIt, false);
      }, false);

    }, false);

    object.addEventListener('touchstart', function (e: any) {
      e.preventDefault();

      initX = this.offsetLeft;
      initY = this.offsetTop;
      const touch = e.touches;
      firstX = touch[0].pageX;
      firstY = touch[0].pageY;

      this.addEventListener('touchmove', swipeIt, false);

      window.addEventListener('touchend', function (event: any) {
        event.preventDefault();
        object.removeEventListener('touchmove', swipeIt, false);
      }, false);

    }, false);

    function dragIt(e: any) {
      this.style.left = initX + e.pageX - firstX + 'px';
      this.style.top = initY + e.pageY - firstY + 'px';
    }

    function swipeIt(e: any) {
      const contact = e.touches;
      this.style.left = initX + contact[0].pageX - firstX + 'px';
      this.style.top = initY + contact[0].pageY - firstY + 'px';
    }
  }

  private timerChecker() {
    document.getElementsByClassName('video-stream')[0]
      .addEventListener('timeupdate', function() {
        console.log(this);
      });
  }
}

export default new ContentVideoPin();
