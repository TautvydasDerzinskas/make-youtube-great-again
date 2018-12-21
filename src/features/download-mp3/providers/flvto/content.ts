import ProviderService from '../../services/provider.service';
import featureStorageService from '../../../../services/common/feature-storage.service';

import ProviderMeta from './meta';
import FeatureMeta from '../../meta';

class ProviderFlvo extends ProviderService {
  public static initialize() {
    featureStorageService.getFeatureData(FeatureMeta.id).then(featureEnabled => {
      if (featureEnabled && window.location.href.toLowerCase().includes(ProviderMeta.url)) {
        (<HTMLInputElement>document.getElementById('convertUrl')).value = this.getYoutubeUrl();
        document.getElementsByTagName('button')[0].click();
      }
    });
  }
}

ProviderFlvo.initialize();
