import urlService from '../../services/common/url.service';
import svgIconsService from '../../services/content/svg-icons.service';
import featureStorageService from '../../services/common/feature-storage.service';

import Meta from './meta';
import { YoutubeSelectors, ApiKeys, SvgIcons } from '../../enums';
import IContent from '../../interfaces/content';

import './styles/thumbnail-stats.scss';

class ContentThumbnailStats implements IContent {
  private bodyObserver: MutationObserver;

  public extendPageUserInterface() {
    document.getElementsByTagName('body')[0]
      .classList.add('myga-thumbnail-stats--enabled');
  }

  public setupEventListeners() {
    this.setupObserver();

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
      $div.innerHTML += svgIconsService.getIcon(SvgIcons.Thumb);
      $div.innerHTML += svgIconsService.getIcon(SvgIcons.Progress);
      $div.className = 'myga-thumb-stats myga-thumb-stats--loading';
      $thumb.classList.add('myga-thumb-container');
      $thumb.appendChild($div);

      const videoId = this.getThumbVideoId($thumb);

      featureStorageService.trackVideo(Meta.id, videoId);

      const req = new XMLHttpRequest();
      req.open('GET', `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${ApiKeys.DataApiV3}`);
      const _self = this;
      req.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          const response = JSON.parse(this.responseText);
          const stats = response.items[0].statistics;
          _self.updateIndicator(
            parseInt(stats.likeCount, 10),
            parseInt(stats.dislikeCount, 10),
            $div
          );
        }
      };
      req.send();
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
