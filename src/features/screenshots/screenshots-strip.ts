import screenshotsService, { IScreenshot } from './services/screenshots.service';
import svgIconsService from '../../services/content/svg-icons.service';
import tooltipService from '../../services/content/tooltip.service';

const STRIP_CLASS = 'myga-screenshots-strip';

/**
 * The current video's screenshots, under our action buttons & above the video's description
 */
export default class ScreenshotsStrip {
  private videoId: string = null;
  private screenshots: IScreenshot[] = [];
  private pageObserver: MutationObserver;
  private removeStorageListener: () => void;

  public attach(videoId: string) {
    this.detach();
    this.videoId = videoId;

    this.removeStorageListener = screenshotsService.onChange(() => this.load());
    // YouTube™ re-renders the area under the video
    const aboveTheFold = document.querySelector('ytd-watch-metadata #above-the-fold');
    if (aboveTheFold) {
      this.pageObserver = new MutationObserver(() => this.insert());
      this.pageObserver.observe(aboveTheFold, { childList: true, subtree: true });
    }
    this.load();
  }

  public detach() {
    if (this.pageObserver) {
      this.pageObserver.disconnect();
      this.pageObserver = null;
    }
    if (this.removeStorageListener) {
      this.removeStorageListener();
      this.removeStorageListener = null;
    }
    document.querySelectorAll(`.${STRIP_CLASS}`).forEach(strip => strip.remove());
    this.screenshots = [];
  }

  private async load() {
    this.screenshots = await screenshotsService.getForVideo(this.videoId);
    this.render();
  }

  private get strip() {
    return document.querySelector<HTMLElement>(`.${STRIP_CLASS}`);
  }

  /**
   * After our action buttons row (or YouTube™'s top row, when there are none)
   */
  private insert() {
    const anchor = document.querySelector('ytd-watch-metadata .myga-action-row') || document.querySelector('ytd-watch-metadata #top-row');
    const strip = this.strip;
    if (!anchor || !strip || anchor.nextElementSibling === strip) {
      return;
    }
    anchor.after(strip);
  }

  private render() {
    let strip = this.strip;
    if (this.screenshots.length === 0) {
      if (strip) {
        strip.remove();
      }
      return;
    }

    if (!strip) {
      strip = document.createElement('div');
      strip.className = STRIP_CLASS;
      document.body.append(strip);
    }
    strip.replaceChildren(...this.screenshots.map(screenshot => this.createItem(screenshot)));
    this.insert();
  }

  private createItem(screenshot: IScreenshot) {
    const item = document.createElement('div');
    item.className = `${STRIP_CLASS}__item`;

    const image = document.createElement('img');
    image.src = screenshot.thumbnail;
    image.alt = '';

    const time = document.createElement('span');
    time.className = `${STRIP_CLASS}__time`;
    time.textContent = screenshotsService.formatTime(screenshot.time);

    const actions = document.createElement('div');
    actions.className = `${STRIP_CLASS}__actions`;
    actions.append(
      this.createAction(svgIconsService.iconDownload, 'Download', () => this.download(screenshot)),
      this.createAction(svgIconsService.iconDelete, 'Delete', () => {
        if (confirm('Delete this screenshot?')) {
          screenshotsService.remove(screenshot.id);
        }
      }),
    );

    // Clicking the thumbnail jumps to that moment
    item.addEventListener('click', () => this.seekTo(screenshot.time));
    tooltipService.attach(item, `Go to ${screenshotsService.formatTime(screenshot.time)}`);

    item.append(image, time, actions);
    return item;
  }

  private createAction(icon: string, label: string, onClick: () => void) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${STRIP_CLASS}__action`;
    button.setAttribute('aria-label', label);
    // Parsed, not innerHTML: the add-on validator flags every innerHTML
    button.append(new DOMParser().parseFromString(icon, 'image/svg+xml').documentElement);
    tooltipService.attach(button, label);
    button.addEventListener('click', (event: Event) => {
      event.stopPropagation();
      onClick();
    });
    return button;
  }

  private seekTo(time: number) {
    const video = document.querySelector<HTMLVideoElement>('#movie_player video.html5-main-video')
      || document.querySelector<HTMLVideoElement>('video.html5-main-video');
    if (video) {
      video.currentTime = time;
    }
  }

  private async download(screenshot: IScreenshot) {
    const image = await screenshotsService.getImage(screenshot.id);
    if (!image) {
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(await (await fetch(image)).blob());
    link.download = screenshotsService.fileName(screenshot);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 10000);
  }
}
