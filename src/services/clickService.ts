import HistoryService from '../services/historyService';
import { ProviderFlvo } from '../providers/flvto';
import { ProviderOnlineVideoConverter } from '../providers/onlinevideoconverter';
import { ProviderSaveMp3 } from '../providers/savemp3';

import { MessageTypes } from '../enums/messagesEnums';
import { Selectors } from '../enums/selectorsEnums';

import ISong from '../interfaces/song';

export default class ClickService {
  constructor(
    private historyService: HistoryService,
  ) {}

  public setupSaveButtonClick(tab: chrome.tabs.Tab) {
    const saveButtons = document.getElementsByClassName(Selectors.SongSaveButton);
    for (let i = 0, b = saveButtons.length; i < b; i += 1) {
      const _self = this;
      saveButtons[i].addEventListener('click', function() {
        const saveButtonType = this.getAttribute('data-type');
        chrome.tabs.sendMessage(tab.id, MessageTypes.GetSong, (song: ISong) => {
          if (song) {
            _self.historyService.addSong(song);
          }

          switch (saveButtonType) {
            case ProviderSaveMp3.NAME:
              chrome.tabs.create({ url: ProviderSaveMp3.URL + tab.url });
            break;
            case ProviderOnlineVideoConverter.NAME:
              chrome.tabs.create({ url: ProviderOnlineVideoConverter.URL + '#' + song.id });
            break;
            case ProviderFlvo.NAME:
            default:
              chrome.tabs.create({ url: ProviderFlvo.URL + '#' + song.id });
            break;
          }
          window.close();
        });
      });
    }
  }

  public setupSongRemoveButtonClick() {
    const $deleteButtons = document.getElementsByClassName(Selectors.SongDeleteButton);
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
