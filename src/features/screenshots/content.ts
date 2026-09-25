import screenshotsService from './services/screenshots.service';
import ScreenshotsStrip from './screenshots-strip';
import svgIconsService from '../../services/content/svg-icons.service';
import actionButtonService from '../../services/content/action-button.service';
import urlService from '../../services/common/url.service';

import IContent from '../../interfaces/content';
import { YoutubeSelectors } from '../../enums';

import '../../services/content/action-button.scss';
import './styles/screenshots.scss';

const BUTTON_LABEL = 'Screenshot';
const THUMBNAIL_WIDTH = 320;
const FEEDBACK_TIME = 1500;

class ContentScreenshots implements IContent {
  private buttonsObserver: MutationObserver;
  private feedbackTimer: ReturnType<typeof setTimeout>;
  private strip = new ScreenshotsStrip();

  get screenshotButton() {
    return document.getElementsByClassName('myga-screenshot-btn')[0] as HTMLButtonElement;
  }

  /**
   * The main player's video, wherever it is (also while the floating video feature pins it)
   */
  get videoElement() {
    return document.querySelector(`#movie_player ${YoutubeSelectors.VideoPlayer}`) as HTMLVideoElement
      || document.querySelector(YoutubeSelectors.VideoPlayer) as HTMLVideoElement;
  }

  public extendPageUserInterface() {
    this.cleanUp();

    const $button = actionButtonService.create('myga-screenshot-btn', BUTTON_LABEL, svgIconsService.iconCamera, 'Save a screenshot of the current frame');
    this.buttonsObserver = actionButtonService.attach($button);

    this.strip.attach(urlService.getQueryParameterByName('v'));
  }

  public setupEventListeners() {
    this.screenshotButton.addEventListener('click', () => this.takeScreenshot());
  }

  public cleanUp() {
    clearTimeout(this.feedbackTimer);
    this.strip.detach();
    if (this.buttonsObserver) {
      this.buttonsObserver.disconnect();
      this.buttonsObserver = null;
    }
    document.querySelectorAll('.myga-screenshot-btn, .myga-screenshot-flash').forEach(element => element.remove());
  }

  private async takeScreenshot() {
    const video = this.videoElement;
    // Not loaded yet (or an ad in between)
    if (!video || video.readyState < 2 || !video.videoWidth) {
      this.showFeedback('No frame yet');
      return;
    }

    let image: string;
    let thumbnail: string;
    try {
      // Full resolution of the quality currently playing
      image = this.capture(video, video.videoWidth, video.videoHeight, 0.92);
      thumbnail = this.capture(video, THUMBNAIL_WIDTH, Math.round(THUMBNAIL_WIDTH * video.videoHeight / video.videoWidth), 0.7);
    } catch {
      // Protected videos (e.g. rented movies) can't be captured
      this.showFeedback('Can\'t capture');
      return;
    }

    this.flash();
    await screenshotsService.add({
      videoId: urlService.getQueryParameterByName('v'),
      videoTitle: this.videoTitle,
      time: Math.floor(video.currentTime),
      width: video.videoWidth,
      height: video.videoHeight,
      thumbnail,
    }, image);
    this.showFeedback('Saved');
  }

  private capture(video: HTMLVideoElement, width: number, height: number, quality: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  }

  private get videoTitle() {
    const title = document.querySelector('ytd-watch-metadata #title h1');
    return title && title.textContent.trim() || document.title.replace(/ - YouTube$/, '');
  }

  /**
   * A camera flash over the player
   */
  private flash() {
    const player = document.getElementById('movie_player');
    if (!player) {
      return;
    }
    const flash = document.createElement('div');
    flash.className = 'myga-screenshot-flash';
    flash.addEventListener('animationend', () => flash.remove());
    player.append(flash);
  }

  private showFeedback(text: string) {
    const label = this.screenshotButton && this.screenshotButton.querySelector('.ytSpecButtonShapeNextButtonTextContent');
    if (!label) {
      return;
    }
    label.textContent = text;
    clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => {
      label.textContent = BUTTON_LABEL;
    }, FEEDBACK_TIME);
  }
}

export default new ContentScreenshots();
