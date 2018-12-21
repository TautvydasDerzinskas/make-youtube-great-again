import ProviderService from '../../services/provider.service';
import featureStorageService from '../../../../services/common/feature-storage.service';

import ProviderMeta from './meta';
import FeatureMeta from '../../meta';

class ProviderOnlineVideoConverter extends ProviderService {
  public static initialize() {
    featureStorageService.getFeatureData(FeatureMeta.id).then(featureEnabled => {
      if (featureEnabled && window.location.href.toLowerCase().includes(ProviderMeta.url)) {
        (<HTMLInputElement>document.getElementById('texturl')).value = this.getYoutubeUrl();

        const dropdownElements = document.querySelectorAll('[data-value]');
        for (let i = 0, b = dropdownElements.length; i < b; i += 1) {
          const value = dropdownElements[i].getAttribute('data-value');
          if (value === 'mp3' || value === '320') {
            dropdownElements[i].classList.add('active');
          } else {
            dropdownElements[i].classList.remove('active');
          }
        }

        document.getElementById('convert1').click();
      }
    });
  }
}

ProviderOnlineVideoConverter.initialize();
