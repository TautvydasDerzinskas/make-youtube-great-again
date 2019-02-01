import dragService from '../../services/common/drag.service';
import svgIconsService from '../../services/content/svg-icons.service';
import featureStorageService from '../../services/common/feature-storage.service';

import IContent from '../../interfaces/content';
import Meta from './meta';

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
  private videoSize: number;

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
    this.cleanUp();

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

  setupEventListeners() {
    featureStorageService.getFeatureData(Meta.id).then(featureData => {
      this.videoSize = featureData.data.size;
      this.updatePinnedVideoSize(featureData.data.size);
      this.createSizeClickHandlers();

      this.createPlayPauseClickHandler();

      this.timerChecker();

      const videoHeight = this.videoStreamElement.clientHeight;
      this.videoScrollBreakpoint = this.getElementTopCoords(this.videoStreamElement) + videoHeight;
      this.onScroll();
      this.scrollEventCallback = this.onScroll.bind(this);
      window.addEventListener('scroll', this.scrollEventCallback);
    });
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

  private createSizeClickHandlers() {
    const plusButton = document.querySelector('.pinned-video__button.button--plus');
    const minusButton = document.querySelector('.pinned-video__button.button--minus');

    minusButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      if (0 < this.videoSize) {
        this.videoSize--;
        featureStorageService.storeFeatureData(Meta.id, { size: this.videoSize }).then(featureData => {
          this.updatePinnedVideoSize(featureData.data.size);
        });
      }
    }, false);

    plusButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
      if (3 > this.videoSize) {
        this.videoSize++;
        featureStorageService.storeFeatureData(Meta.id, { size: this.videoSize }).then(featureData => {
          this.updatePinnedVideoSize(featureData.data.size);
        });
      }
    }, false);
  }

  private updatePinnedVideoSize(size: number) {
    this.pinnedVideoElement.classList.remove(`pinned-video--size-0`);
    this.pinnedVideoElement.classList.remove(`pinned-video--size-1`);
    this.pinnedVideoElement.classList.remove(`pinned-video--size-2`);
    this.pinnedVideoElement.classList.remove(`pinned-video--size-3`);

    this.pinnedVideoElement.classList.add(`pinned-video--size-${size}`);
  }

  private createPlayPauseClickHandler() {
    const playPauseButton = document.querySelector(
      '.pinned-video__button.button--play-pause'
    );

    playPauseButton.addEventListener('click', (event: Event) => {
      event.preventDefault();

      if (this.isVideoPaused) {
        playPauseButton.innerHTML = svgIconsService.iconPause;
        this.videoStreamElement.play();
      } else {
        playPauseButton.innerHTML = svgIconsService.iconPlay;
        this.videoStreamElement.pause();
      }
    });
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
