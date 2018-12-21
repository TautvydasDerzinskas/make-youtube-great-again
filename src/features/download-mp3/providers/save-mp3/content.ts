import featureStorageService from '../../../../services/common/feature-storage.service';
import ProviderService from '../../services/provider.service';

import ProviderMeta from './meta';
import FeatureMeta from '../../meta';

class ProviderSaveMp3 extends ProviderService {
  public static initialize() {
    featureStorageService.getFeatureData(FeatureMeta.id).then(featureEnabled => {
      if (featureEnabled && window.location.href.toLowerCase().includes(ProviderMeta.url)) {
        const videoId = window.location.href.split('?v=')[1];
        this.registerConvertion(FeatureMeta.id, videoId);
      }
    });
  }
}

ProviderSaveMp3.initialize();
