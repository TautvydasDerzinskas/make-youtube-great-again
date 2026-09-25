import dragService from '../../services/common/drag.service';
import featureStorageService from '../../services/common/feature-storage.service';
import urlService from '../../services/common/url.service';

import iconClose from '../../assets/vectors/close.svg';
import iconPlus from '../../assets/vectors/plus.svg';
import iconMinus from '../../assets/vectors/minus.svg';
import iconPause from '../../assets/vectors/pause.svg';
import iconPlay from '../../assets/vectors/play.svg';

import Meta from './meta';
import IContent from '../../interfaces/content';
import { IVideoPinData } from './interfaces/video-pin.interface';
import { YoutubeSelectors } from '../../enums';

import './styles/video-pin.scss';

class ContentVideoPin implements IContent {
  private isVideoPinned = false;
  private videoSize: number;
  private wasClosed = false;
  private scrollEventCallback: () => void;
  private resizeEventCallback: () => void;
  private timeUpdateEventCallback: () => void;
  private trackedVideoElement: HTMLVideoElement;
  private videoOriginalParent: Node;
  private videoOriginalNextSibling: Node;

  get pinnedVideoElement() {
    return document.getElementsByClassName('pinned-video')[0] as HTMLElement;
  }

  get pinnedVideoInnerElement() {
    return document.getElementsByClassName('pinned-video__inner')[0] as HTMLElement;
  }

  get pinnedVideoProgressBarElement() {
    return document.getElementsByClassName('pinned-video__progress-bar')[0] as HTMLElement;
  }

  /**
   * The pinned video or the main player's video, never the hover previews that share the `video-stream` class
   */
  get videoStreamElement() {
    const pinnedVideo = this.pinnedVideoInnerElement && this.pinnedVideoInnerElement.querySelector('video');
    return pinnedVideo
      || document.querySelector(`#movie_player ${YoutubeSelectors.VideoPlayer}`) as HTMLVideoElement
      || document.querySelector(YoutubeSelectors.VideoPlayer) as HTMLVideoElement;
  }

  /**
   * Keeps its size while the video is pinned, so it tells where the video belongs on the page
   */
  get playerElement() {
    return document.getElementById('movie_player') || document.querySelector('.html5-video-container') as HTMLElement;
  }

  public extendPageUserInterface() {
    const videoId = urlService.getQueryParameterByName('v');

    if (videoId) {
      this.cleanUp();

      const videoPinElement = document.createElement('div');
      videoPinElement.className = 'pinned-video';
      videoPinElement.innerHTML = `
        <div class="pinned-video__inner"></div>
        <button class="pinned-video__button button--close" type="button">
          ${iconClose}
        </button>
        <button class="pinned-video__button button--plus" type="button">
          ${iconPlus}
        </button>
        <button class="pinned-video__button button--minus" type="button">
          ${iconMinus}
        </button>
        <button class="pinned-video__button button--play-pause" type="button">
          <span></span>
          ${iconPause}
        </button>
        <div class="pinned-video__progress-bar ytp-play-progress"></div>
      `;
      document.body.appendChild(videoPinElement);

      dragService.makeElementDraggable(videoPinElement);
      videoPinElement.addEventListener('transitionend', () => dragService.keepElementInViewport(videoPinElement));
    }
  }

  setupEventListeners() {
    const videoId = urlService.getQueryParameterByName('v');

    if (videoId) {
      featureStorageService.getFeatureData<IVideoPinData>(Meta.id).then(featureData => {
        if (!this.pinnedVideoElement) {
          return;
        }

        this.videoSize = featureData.data.size;
        this.updatePinnedVideoSize(featureData.data.size);
        this.createSizeClickHandlers();

        this.createPlayPauseClickHandler();
        this.createCloseClickHandler();

        this.timerChecker();

        this.scrollEventCallback = this.onScroll.bind(this);
        window.addEventListener('scroll', this.scrollEventCallback);
        this.resizeEventCallback = () => dragService.keepElementInViewport(this.pinnedVideoElement);
        window.addEventListener('resize', this.resizeEventCallback);
        this.onScroll();
      });
    }
  }

  public cleanUp() {
    if (this.isVideoPinned) {
      this.hide();
    }

    if (this.pinnedVideoElement) {
      this.pinnedVideoElement.remove();
    }

    window.removeEventListener('scroll', this.scrollEventCallback);
    window.removeEventListener('resize', this.resizeEventCallback);
    this.scrollEventCallback = null;
    this.resizeEventCallback = null;

    if (this.trackedVideoElement) {
      this.trackedVideoElement.removeEventListener('timeupdate', this.timeUpdateEventCallback);
      this.trackedVideoElement = null;
    }

    this.wasClosed = false;
  }

  private createCloseClickHandler() {
    document.querySelector('.pinned-video__button.button--close')
      .addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.wasClosed = true;
      this.hide();
    }, false);
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

      if (this.videoStreamElement.paused) {
        playPauseButton.innerHTML = `<span></span>${iconPause}`;
        this.videoStreamElement.play();
      } else {
        playPauseButton.innerHTML = `<span></span>${iconPlay}`;
        this.videoStreamElement.pause();
      }
    });
  }

  /**
   * Measured on every scroll, so theater mode, resizing
   * and late loading page parts can't make it stale
   */
  private get isPlayerOutOfView() {
    const player = this.playerElement;
    return player ? player.getBoundingClientRect().bottom <= 0 : false;
  }

  /**
   * Set by the audio mode feature, nothing to watch in a floating video then
   */
  private get isAudioModeActive() {
    const player = document.getElementById('movie_player');
    return player ? player.classList.contains('myga-audio-mode--active') : false;
  }

  /**
   * Set by the cinema mode feature, which keeps the video in place
   */
  private get isCinemaModeActive() {
    return document.documentElement.classList.contains('myga-cinema-mode--active');
  }

  private onScroll() {
    if (this.isPlayerOutOfView) {
      if (!this.isVideoPinned && !this.wasClosed && !this.isAudioModeActive && !this.isCinemaModeActive && this.videoStreamElement && !this.videoStreamElement.paused) {
        this.show();
      }
    } else {
      if (this.isVideoPinned) {
        this.hide();
      }
      this.wasClosed = false;
    }
  }

  private show() {
    const video = this.videoStreamElement;

    this.videoOriginalParent = video.parentNode;
    this.videoOriginalNextSibling = video.nextSibling;

    this.pinnedVideoElement.classList.add('pinned-video--active');
    this.pinnedVideoInnerElement.appendChild(video);
    dragService.keepElementInViewport(this.pinnedVideoElement);

    this.isVideoPinned = true;
  }

  private hide() {
    if (this.pinnedVideoElement) {
      this.pinnedVideoElement.classList.remove('pinned-video--active');
    }

    const video = this.pinnedVideoInnerElement && this.pinnedVideoInnerElement.querySelector('video');
    const originalParent = this.videoOriginalParent && this.videoOriginalParent.isConnected
      ? this.videoOriginalParent
      : document.querySelector('#movie_player .html5-video-container');

    if (video && originalParent) {
      const nextSibling = this.videoOriginalNextSibling && this.videoOriginalNextSibling.parentNode === originalParent
        ? this.videoOriginalNextSibling
        : null;
      originalParent.insertBefore(video, nextSibling);

      // Makes YouTube™ re-fit the video to its player, which may have changed while it was pinned
      window.dispatchEvent(new Event('resize'));
    }

    this.videoOriginalParent = null;
    this.videoOriginalNextSibling = null;
    this.isVideoPinned = false;
  }

  private timerChecker() {
    this.trackedVideoElement = this.videoStreamElement;
    if (!this.trackedVideoElement) {
      return;
    }

    this.timeUpdateEventCallback = () => {
      const videoElement = this.trackedVideoElement;

      if (this.isVideoPinned) {
        const barWidth = videoElement.currentTime / videoElement.duration * videoElement.clientWidth;
        this.pinnedVideoProgressBarElement.style.width = `${barWidth}px`;
      }

      if (videoElement.ended && this.isVideoPinned) {
        this.hide();
      }
    };
    this.trackedVideoElement.addEventListener('timeupdate', this.timeUpdateEventCallback);
  }
}

export default new ContentVideoPin();
