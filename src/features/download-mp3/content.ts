import urlService from '../../services/common/url.service';
import svgIconsService from '../../services/content/svg-icons.service';
import Meta from './meta';
import MetaProviders from './providers/providers';
import { YoutubeSelectors } from '../../enums';
import IContent from '../../interfaces/content';

import './styles/download-mp3.scss';

class ContentDownloadMp3 implements IContent {
  public extendPageUserInterface() {
    this.cleanUp();

    document.getElementsByTagName('body')[0].classList.add('myga-download-mp3--enabled');

    const appendTo = document.querySelector(YoutubeSelectors.MenuBeforeDropdown);
    const dropdownHtml = `
      <button class="dropbtn myga-download-mp3-btn">${svgIconsService.iconDownloadMp3}</button>
      <div class="myga-dropdown-content">
        ${this.generateDropdownTemplate()}
      </div>
    `;

    const $button = document.createElement('div');
    $button.className = 'myga-dropdown';
    $button.setAttribute('title', Meta.description);
    $button.innerHTML = dropdownHtml;
    appendTo.appendChild($button);
  }

  private generateDropdownTemplate() {
    const videoId = urlService.getQueryParameterByName('v');

    let dropdownHtml = '';
    MetaProviders.forEach(meta => {
      const attachUrl = meta.withHash ? '#' + videoId : window.location.href;
      dropdownHtml += `
        <a title="${meta.name}" target="_blank" href="${meta.url}${attachUrl}">
          Get mp3 (${meta.name})
        </a>
      `;
    });
    return dropdownHtml;
  }

  public cleanUp() {
    document.getElementsByTagName('body')[0]
      .classList.remove('myga-download-mp3--enabled');

    const $looperButtons = document.getElementsByClassName('myga-dropdown');
    if ($looperButtons.length > 0) {
      for (let i = 0, b = $looperButtons.length; i < b; i += 1) {
        $looperButtons[i].remove();
      }
    }
  }
}

export default new ContentDownloadMp3();
