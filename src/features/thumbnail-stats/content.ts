import { YoutubeSelectors } from '../../enums';

import IContent from '../../interfaces/content';

class ContentThumbnailStats implements IContent {
  public extendPageUserInterface(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  public setupEventListeners(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  public setupCommunications(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export default new ContentThumbnailStats();
