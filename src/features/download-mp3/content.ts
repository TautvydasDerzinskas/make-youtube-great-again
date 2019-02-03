import urlService from '../../services/common/url.service';
import svgIconsService from '../../services/content/svg-icons.service';
import featureStorageService from '../../services/common/feature-storage.service';

import Meta from './meta';
import MetaProviders from './providers/providers';
import { YoutubeSelectors } from '../../enums';
import IContent from '../../interfaces/content';
import { IDownloadMp3Data } from './interfaces/download-mp3.interface';

import './styles/download-mp3.scss';

class ContentDownloadMp3 implements IContent {
  public extendPageUserInterface() {
    this.cleanUp();

    document.getElementsByTagName('body')[0].classList.add('myga-download-mp3--enabled');

    featureStorageService.getFeatureData<IDownloadMp3Data>(Meta.id).then(featureData => {
      const appendTo = document.querySelector(YoutubeSelectors.MenuBeforeDropdown);
      const dropdownHtml = `
        <button class="dropbtn myga-download-mp3-btn">${svgIconsService.iconDownloadMp3}</button>
        <div class="myga-dropdown-content">
          ${this.generateDropdownTemplate(featureData.data)}
        </div>
      `;

      const $button = document.createElement('div');
      $button.className = 'myga-dropdown';
      $button.setAttribute('title', Meta.description);
      $button.innerHTML = dropdownHtml;
      appendTo.appendChild($button);

      const providerLinkElements = document.querySelectorAll('.myga-dropdown a');
      for (let i = 0, b = providerLinkElements.length; i < b; i += 1) {
        providerLinkElements[i].addEventListener('click', () => {
          const videoId = urlService.getQueryParameterByName('v');
          featureStorageService.trackVideo(Meta.id, videoId);
        });
      }
    });
  }

  private generateDropdownTemplate(featureData: any) {
    const videoId = urlService.getQueryParameterByName('v');

    return MetaProviders.map(meta => {
      if (featureData[meta.id]) {
        return `
          <a title="${meta.name}" target="_blank" href="${meta.downloadLink(videoId)}">
            Get mp3 (${meta.name})
          </a>
        `;
      }
    });
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
