import looperService from './services/looper.service';
import svgIconsService from '../../services/content/svg-icons.service';
import actionButtonService from '../../services/content/action-button.service';
import urlService from '../../services/common/url.service';
import featureStorageService from '../../services/common/feature-storage.service';

import Meta from './meta';
import IContent from '../../interfaces/content';

import '../../services/content/action-button.scss';

class ContentLooper implements IContent {
  private buttonsObserver: MutationObserver;

  get looperButton() {
    return document.getElementsByClassName('myga-looper-btn')[0] as HTMLButtonElement;
  }

  public extendPageUserInterface() {
    this.cleanUp();

    const $button = actionButtonService.create('myga-looper-btn', 'Loop', svgIconsService.iconLooper, Meta.description);
    this.buttonsObserver = actionButtonService.attach($button);
  }

  public setupEventListeners() {
    this.looperButton.addEventListener('click', function() {
      looperService.toggle();
      actionButtonService.setActive(this, looperService.LOOPER_STATUS);

      const videoId = urlService.getQueryParameterByName('v');
      featureStorageService.trackVideo(Meta.id, videoId);
    });
  }

  public cleanUp() {
    if (this.buttonsObserver) {
      this.buttonsObserver.disconnect();
      this.buttonsObserver = null;
    }

    const $looperButtons = document.getElementsByClassName('myga-looper-btn');
    while ($looperButtons.length > 0) {
      $looperButtons[0].remove();
    }

    // Otherwise the next video keeps looping while the button shows it doesn't
    looperService.reset();
  }
}

export default new ContentLooper();
