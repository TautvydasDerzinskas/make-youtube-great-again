import { YoutubeSelectors } from '../../enums';
import IContent from '../../interfaces/content';

class ContentDownloadMp3 implements IContent {
  public extendPageUserInterface(): Promise<boolean> {

    return new Promise((resolve) => {
      resolve();
    });
/*
    setTimeout(() => {
      const appendTo = document.querySelector(YoutubeSelectors.MenuAfterDropdown);
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
  */
  }

  public setupEventListeners(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  public setupCommunications(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
    /*
    import UtilityService from './services/utilityService';

    import { MessageTypes } from './enums/messagesEnums';

    const utilityService = new UtilityService();

    chrome.runtime.onMessage.addListener((messageType, sender, sendResponse) => {
      switch (messageType) {
        case MessageTypes.GetSong:
          sendResponse({
            name: utilityService.getYoutubeVideoName(),
            id: utilityService.getQueryParameterByName('v', window.location.href)
          });
        break;
      }
    });
    */
  }
}

export default new ContentDownloadMp3();
