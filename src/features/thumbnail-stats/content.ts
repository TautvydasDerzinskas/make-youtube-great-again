import { YoutubeSelectors } from '../../enums';

import IContent from '../../interfaces/content';

class ContentThumbnailStats implements IContent {
  public setupEventListeners() {
    const thumbnailElements = document.querySelectorAll(YoutubeSelectors.AllThumbnails);

    for (let i = 0, b = thumbnailElements.length; i < b; i += 1) {
      thumbnailElements[i].addEventListener('mouseenter', () => {
        console.log('It works :)');
      });
    }
  }
}

export default new ContentThumbnailStats();
