import dragService from '../../services/common/drag.service';
import svgIconsService from '../../services/content/svg-icons.service';

import IContent from '../../interfaces/content';

import './styles/video-pin.scss';

interface IVideoPlayer extends HTMLElement {
  paused: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
}

class ContentVideoPin implements IContent {
  private isVideoPinned = false;
  private videoScrollBreakpoint: number;
  private scrollEventCallback: any;

  get pinnedVideoElement() {
    return document.getElementsByClassName('pinned-video')[0] as HTMLElement;
  }

  get pinnedVideoInnerElement() {
    return document.getElementsByClassName('pinned-video__inner')[0] as HTMLElement;
  }

  get pinnedVideoProgressBarElement() {
    return document.getElementsByClassName('pinned-video__progress-bar')[0] as HTMLElement;
  }

  get videoStreamElement() {
    return document.getElementsByClassName('video-stream')[0] as IVideoPlayer;
  }

  get isVideoPaused(): boolean {
    return this.videoStreamElement.paused;
  }

  public extendPageUserInterface() {
    if (!this.pinnedVideoElement) {
      const videoPinElement = document.createElement('div');
      videoPinElement.className = 'pinned-video';
      videoPinElement.innerHTML = `
        <div class="pinned-video__inner"></div>
        <button class="pinned-video__button button--plus" type="button">
          ${svgIconsService.iconPlus}
        </button>
        <button class="pinned-video__button button--minus" type="button">
          ${svgIconsService.iconMinus}
        </button>
        <button class="pinned-video__button button--play-pause" type="button">
          ${svgIconsService.iconPause}
        </button>
        <div class="pinned-video__progress-bar ytp-play-progress"></div>
      `;
      document.body.appendChild(videoPinElement);

      dragService.makeElementDraggable(videoPinElement);
    }
  }

  setupEventListeners() {
    this.timerChecker();

    const videoHeight = this.videoStreamElement.clientHeight;
    this.videoScrollBreakpoint = this.getElementTopCoords(this.videoStreamElement) + videoHeight;

    this.onScroll();
    this.scrollEventCallback = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollEventCallback);
  }

  public cleanUp() {
    if (this.pinnedVideoElement) {
      if (this.isVideoPinned) {
        this.hide();
      }
      this.pinnedVideoElement.remove();
      window.removeEventListener('scroll', this.scrollEventCallback);
      this.scrollEventCallback = null;
    }
  }

  private onScroll() {
    const scrolled = window.scrollY;
    if (scrolled >= this.videoScrollBreakpoint && !this.isVideoPinned && !this.isVideoPaused) {
      this.show();
    } else if (scrolled < this.videoScrollBreakpoint && this.isVideoPinned) {
      this.hide();
    }
  }

  private show() {
    this.pinnedVideoElement.classList.add('pinned-video--active');

    this.pinnedVideoInnerElement.appendChild(this.videoStreamElement);

    this.isVideoPinned = true;
  }

  private hide() {
    this.pinnedVideoElement.classList.remove('pinned-video--active');

    const realVideoContainer = document.getElementsByClassName('html5-video-container')[0];
    realVideoContainer.appendChild(this.videoStreamElement);

    this.isVideoPinned = false;
  }

  private timerChecker() {
    this.videoStreamElement.addEventListener('timeupdate', () => {
      const videoElement = this.videoStreamElement;

      const barWidth = videoElement.currentTime / videoElement.duration * videoElement.clientWidth;
      this.pinnedVideoProgressBarElement.style.width = `${barWidth}px`;
      if (videoElement.currentTime === videoElement.duration && this.isVideoPinned) {
        this.hide();
      }
    });
  }

  private getElementTopCoords(element: HTMLElement) {
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    return elemRect.top - bodyRect.top;
  }
}

export default new ContentVideoPin();
