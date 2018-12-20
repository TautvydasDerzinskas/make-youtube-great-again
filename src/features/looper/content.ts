import looperService from './services/looper.service';
import svgIconsService from '../../services/content/svg-icons.service';
import Meta from './meta';
import { YoutubeSelectors, SvgIcons } from '../../enums';

import IContent from '../../interfaces/content';

import './styles/looper.scss';

class ContentLooper implements IContent {
  public extendPageUserInterface() {
    this.cleanUp();

    looperService.LOOPER_STATUS = false;
    document.getElementsByTagName('body')[0]
      .classList.add('myga-looper--enabled');

    const appendTo = document.querySelector(YoutubeSelectors.MenuBeforeDropdown);
    const $button = document.createElement('button');
    $button.className = 'myga-looper-btn';
    $button.setAttribute('title', Meta.description);
    $button.setAttribute('type', 'button');
    $button.innerHTML = svgIconsService.getIcon(SvgIcons.Looper);
    appendTo.appendChild($button);
  }

  public setupEventListeners() {
    document.getElementsByClassName('myga-looper-btn')[0]
      .addEventListener('click', function() {
      looperService.toggle();
      (<HTMLElement>this).classList.toggle('myga-looper-btn--active');
    });
  }

  private cleanUp() {
    const $looperButtons = document.getElementsByClassName('myga-looper-btn');
    if ($looperButtons.length > 0) {
      for (let i = 0, b = $looperButtons.length; i < b; i += 1) {
        $looperButtons[i].remove();
      }
    }
  }
}

export default new ContentLooper();
