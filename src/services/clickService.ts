import HistoryService from '../services/historyService';

import { Settings } from '../enums/coreEnums';
import { MessageTypes } from '../enums/messagesEnums';

import ISong from '../interfaces/songInterface';

export default class ClickService {
  constructor(
    private historyService: HistoryService,
  ) {}

  public setupSaveButtonClick(tab: chrome.tabs.Tab) {
    document.getElementById('save-mp3').onclick = () => {
      chrome.tabs.sendMessage(tab.id, MessageTypes.GetSong, (song: ISong) => {
        if (song) {
          this.historyService.addSong(song);
        }
        chrome.tabs.create({ url: Settings.Provider + tab.url });
        window.close();
      });
    };
  }

  public setupSongRemoveButtonClick() {
    const $deleteButtons = document.getElementsByClassName('songs__item__delete');
    for (let i = 0; i < $deleteButtons.length; i += 1) {
      const $button = $deleteButtons[i];
      $button.addEventListener('click', () => {
        const songId = $button.getAttribute('data-id');
        this.historyService.removeSong.apply(this.historyService, [songId]);
        $button.parentElement.remove();
      }, false);
    }
  }
}
