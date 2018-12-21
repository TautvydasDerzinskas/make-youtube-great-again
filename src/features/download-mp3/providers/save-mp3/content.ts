import featureStorageService from '../../../../services/common/feature-storage.service';

import ProviderMeta from './meta';
import FeatureMeta from '../../meta';

class ProviderSaveMp3 {
  public static initialize() {
    featureStorageService.getFeatureData(FeatureMeta.id).then(featureEnabled => {
      if (featureEnabled && window.location.href.toLowerCase().includes(ProviderMeta.url)) {
        // TODO
      }
    });
  }
}

ProviderSaveMp3.initialize();
