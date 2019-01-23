import IContent from '../../interfaces/content';
import MetaCustomProgressBar from './meta';

import featureStorageService from '../../services/common/feature-storage.service';

class ContentCustomProgressBar implements IContent {
  public extendPageUserInterface() {
    this.addIndicatorBackgroundImageStyle();
  }

  public cleanUp() {
    document.getElementsByTagName('body')[0]
      .classList.remove('myga--custom-bar');

    const previousIndicatorStyle = document.querySelector('[name="myga-custom-bar"]');
    if (previousIndicatorStyle) {
      previousIndicatorStyle.remove();
    }
  }

  private addIndicatorBackgroundImageStyle() {
    const previousIndicatorStyle = document.querySelector('[name="myga-custom-bar"]');
    if (previousIndicatorStyle) {
      previousIndicatorStyle.remove();
    }

    featureStorageService.getFeatureData(MetaCustomProgressBar.id).then(featureData => {
      const bodyElement = document.getElementsByTagName('body')[0];

      bodyElement.classList.add('myga--custom-bar');
      bodyElement.classList.add(`bar--${featureData.data.theme}`);

      const style = document.createElement('link');
      style.setAttribute('name', 'myga-custom-bar');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('href', chrome.extension.getURL(`/css/bars/bar__${featureData.data.theme}.css`));
      document.getElementsByTagName('head')[0].appendChild(style);
    });
  }
}

export default new ContentCustomProgressBar();
