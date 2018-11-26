import UtilityService from './services/utilityService';

import { MessageTypes } from './enums/messagesEnums';
import { Selectors } from './enums/selectorsEnums';

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

function insertButton() {
  setTimeout(() => {
    const appendTo = document.querySelector(Selectors.YoutubeAppendButtonContainer);
    if (appendTo) {
      const html = `<div><button>SAVE mp3</button></div>`;
      const element = document.createElement('p');
      element.innerHTML = html;
      while (element.childNodes.length) {
        appendTo.appendChild(element.childNodes[0]);
      }
    } else {
      insertButton();
    }
  });
}

insertButton();
