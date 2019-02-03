import featureStorageService from '../../services/common/feature-storage.service';

import Meta from './meta';
import IContent from '../../interfaces/content';

import './styles/hide-comments.scss';

class ContentHideComments implements IContent {
  public extendPageUserInterface() {
    featureStorageService.getFeatureData(Meta.id).then(featureData => {
      if (featureData.data.comments) {
        document.body.classList.add('myga-hidden-comments--comments');
      }

      if (featureData.data.chat) {
        document.body.classList.add('myga-hidden-comments--chat');
      }
    });
  }

  public cleanUp() {
    document.body.classList.remove('myga-hidden-comments--comments');
    document.body.classList.remove('myga-hidden-comments--chat');
  }
}

export default new ContentHideComments();
