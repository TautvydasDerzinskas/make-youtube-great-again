import ProviderService from '../services/provider.service';
import featureStorageService from '../../../services/common/feature-storage.service';

import FeatureMeta from '../meta';

export default class ProviderFlvo {
  public static NAME = 'Flvto';
  public static URL = 'https://www.flvto.biz';

  public static initialize() {
    featureStorageService.getFeature(FeatureMeta.id).then(featureEnabled => {
      if (featureEnabled && window.location.href.toLowerCase().includes(this.URL)) {
        (<HTMLInputElement>document.getElementById('convertUrl')).value = ProviderService.getYoutubeUrl();
        document.getElementsByTagName('button')[0].click();
      }
    });
  }
}
