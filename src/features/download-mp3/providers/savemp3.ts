import featureStorageService from '../../../services/common/feature-storage.service';

import FeatureMeta from '../meta';

export default class ProviderSaveMp3 {
  public static NAME = 'Save-Mp3';
  public static URL = 'https://savemp3.net/frame/button/?quality=320&video=';

  public static initialize() {
    featureStorageService.getFeature(FeatureMeta.id).then(featureEnabled => {
      if (featureEnabled && window.location.href.toLowerCase().includes(this.URL)) {
        // TODO
      }
    });
  }
}
