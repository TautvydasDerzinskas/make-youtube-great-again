import YoutubeSelectors from './enums/youtubeSelectors';

import ProviderFlvto from './providers/flvto';
import ProviderOnlineVideoConverter from './providers/onlinevideoconverter';
import ProviderSaveMp3 from './providers/savemp3';

import IContent from '../../interfaces/content';

class ContentDownloadMp3 implements IContent {
  constructor() {}

  public performEvents() {
    ProviderFlvto.initialize();
    ProviderOnlineVideoConverter.initialize();
    ProviderSaveMp3.initialize();
  }

  public extendPageUserInterface() {
    setTimeout(() => {
      const appendTo = document.querySelector(YoutubeSelectors.ButtonsContainer);
      if (appendTo) {
        const html = `<div><button>SAVE mp3</button></div>`;
        const element = document.createElement('p');
        element.innerHTML = html;
        while (element.childNodes.length) {
          appendTo.appendChild(element.childNodes[0]);
        }
      } else {
        this.extendPageUserInterface();
      }
    });
  }
}

export default new ContentDownloadMp3();
