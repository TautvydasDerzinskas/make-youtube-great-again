import HistoryService from '../services/historyService';

import ISong from '../interfaces/songInterface';
import { Selectors } from '../enums/selectorsEnums';

export default class UiService {
  constructor(
    private historyService: HistoryService,
  ) {}

  public renderSongList() {
    return new Promise((resolve) => {
      this.historyService.getSongs().then((songs: ISong[]) => {
        let htmlTpl = '';
        songs.forEach(song => { htmlTpl += this.getSongListItemTpl(song); });
        document.getElementsByClassName(Selectors.SongListContainer)[0].innerHTML = htmlTpl;
        resolve(true);
      });
    });
  }

  public hideSaveButtons() {
    document.getElementsByClassName(Selectors.SongSaveButtons)[0]
      .classList.add(Selectors.HideClass);
  }

  private getSongListItemTpl(song: ISong) {
    return `
      <li class="${Selectors.SongContainer}">
        ${song.name}
        <button class="${Selectors.SongDeleteButton}" data-id="${song.id}">Delete</button>
      </li>`;
  }
}
