import UtilityService from './services/utilityService';

import { MessageTypes } from './enums/messagesEnums';

const utilityService = new UtilityService();

chrome.runtime.onMessage.addListener((messageType, sender, sendResponse) => {
  switch (messageType) {
    case MessageTypes.GetSong:
      sendResponse({
        name: utilityService.getYoutubeClipName(),
        id: utilityService.getQueryParameterByName('v', window.location.href)
      });
    break;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  try {
    const $buttonContainer = document.getElementById('subscribe-button');
    const element = document.createElement('p');
    const text = document.createTextNode('Example text');
    element.appendChild(text);
    document.insertBefore($buttonContainer, element);
  } catch (e) {
    console.log(e);
  }
});
