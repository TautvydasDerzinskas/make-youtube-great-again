import urlService from '../../services/common/url.service';
import svgIconsService from '../../services/content/svg-icons.service';
import featureStorageService from '../../services/common/feature-storage.service';

import Meta from './meta';
import { YoutubeSelectors, ApiKeys } from '../../enums';
import IContent from '../../interfaces/content';

import './styles/thumbnail-stats.scss';

class ContentThumbnailStats implements IContent {
  private bodyObserver: MutationObserver;
  private videoId: string = urlService.getQueryParameterByName('v', window.location.href);
  private isDestructionInProgress = false;

  public extendPageUserInterface() {
    document.getElementsByTagName('body')[0]
      .classList.add('myga-thumbnail-stats--enabled');
  }

  public setupEventListeners() {
    this.setupObserver();

    this.destructOldMouseEnterEvents();

    const thumbnailElements = document.querySelectorAll(YoutubeSelectors.AllThumbnails);

    for (let i = 0, b = thumbnailElements.length; i < b; i += 1) {
      const $thumb = thumbnailElements[i];
      $thumb.addEventListener(
        'mouseenter',
        this.mouseEnterEvent.bind(this, $thumb),
        false
      );
    }
  }

  public cleanUp() {
    document.getElementsByTagName('body')[0]
      .classList.remove('myga-thumbnail-stats--enabled');
  }

  private destructOldMouseEnterEvents() {
    const currentVideoId = urlService.getQueryParameterByName('v', window.location.href);
    if (this.videoId !== currentVideoId && !this.isDestructionInProgress) {
      this.isDestructionInProgress = true;

      const mygaOverlayElements = document.getElementsByClassName('myga-thumb-container');
      for (let i = 0, b = mygaOverlayElements.length; i < b; i += 1) {
        const element = mygaOverlayElements[i];
        if (element) {
          element.classList.remove('myga-thumb-container');
          const statsElement = element.children[(element.children.length - 1)];
          if (statsElement) {
            statsElement.remove();
          }
        }
      }
      this.videoId = currentVideoId;
      this.isDestructionInProgress = false;
    }
  }

  private setupObserver() {
    if (!this.bodyObserver) {
      this.bodyObserver = new MutationObserver(() => {
        this.setupEventListeners();
      });
      this.bodyObserver.observe(
        document.body,
        { subtree: true, childList: true },
      );
    }
  }

  private mouseEnterEvent($thumb: HTMLElement) {
    if (!$thumb.classList.contains('myga-thumb-container')) {
      const $div = document.createElement('div');
      $div.innerHTML += svgIconsService.iconThumb;
      $div.innerHTML += svgIconsService.iconProgress;
      $div.className = 'myga-thumb-stats myga-thumb-stats--loading';
      $thumb.classList.add('myga-thumb-container');
      $thumb.appendChild($div);

      const videoId = this.getThumbVideoId($thumb);

      featureStorageService.trackVideo(Meta.id, videoId);

      fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${ApiKeys.DataApiV3}`)
      .then(res => res.json())
      .then((response) => {
        const stats = response.items[0].statistics;
        this.updateIndicator(
          parseInt(stats.likeCount, 10),
          parseInt(stats.dislikeCount, 10),
          $div
        );
      });
    }
  }

  private getThumbVideoId($linkElement: HTMLElement) {
    const url = $linkElement.getAttribute('href');
    return urlService.getQueryParameterByName('v', url);
  }

  private updateIndicator(likesCount: number, dislikesCount: number, $svgContainer: HTMLElement) {
    const likesPercentage = (likesCount / (likesCount + dislikesCount)) * 100;

    ($svgContainer as any).childNodes[1].childNodes[0]
      .setAttribute('stroke-dasharray', `${likesPercentage}, 100`);

    if (likesCount < dislikesCount) {
      $svgContainer.classList.add('myga-thumb-stats--negative');
    }

    $svgContainer.classList.remove('myga-thumb-stats--loading');
    $svgContainer.setAttribute('title', `Likes: ${likesCount}, dislikes: ${dislikesCount}`);
  }
}

export default new ContentThumbnailStats();
