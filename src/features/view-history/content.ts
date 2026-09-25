import featureStorageService from '../../services/common/feature-storage.service';
import urlService from '../../services/common/url.service';

import Meta from './meta';
import IContent from '../../interfaces/content';

class ContentViewHistory implements IContent {
  /**
   * Runs on every video page, also when moving between videos without a page reload
   */
  public extendPageUserInterface() {
    featureStorageService.trackVideo(Meta.id, urlService.getQueryParameterByName('v'));
  }

  public cleanUp() {
    // Nothing on the page to remove, the history is kept
  }
}

export default new ContentViewHistory();
