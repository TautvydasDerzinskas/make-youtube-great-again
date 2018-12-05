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
