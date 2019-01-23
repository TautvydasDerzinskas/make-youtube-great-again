import ProviderService from '../../services/provider.service';
import featureStorageService from '../../../../services/common/feature-storage.service';

import ProviderMeta from './meta';
import FeatureMeta from '../../meta';

class ProviderOnlineVideoConverter extends ProviderService {
  public static initialize() {
    featureStorageService.getFeatureData(FeatureMeta.id).then(featureEnabled => {
      if (featureEnabled && window.location.href.toLowerCase().includes(ProviderMeta.url)) {
        const videoId = window.location.href.split('?v=')[1];
        window.location.assign(`http://dl.simpleyoutubeconverter.com/yt/${videoId}?dl=mp3`);

      }
    });
  }
}

ProviderOnlineVideoConverter.initialize();
