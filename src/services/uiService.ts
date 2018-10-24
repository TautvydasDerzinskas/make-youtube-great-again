import HistoryService from '../services/historyService';

import ISong from '../interfaces/songInterface';

export default class UiService {
  constructor(
    private historyService: HistoryService,
  ) {}

  public renderSongList() {
    return new Promise((resolve) => {
      this.historyService.getSongs().then((songs: ISong[]) => {
        let htmlTpl = '';
        songs.forEach(song => { htmlTpl += this.getSongListItemTpl(song); });
        document.getElementsByClassName('songs')[0].innerHTML = htmlTpl;
        resolve(true);
      });
    });
  }

  public hideSaveButton() {
    document.getElementById('save-mp3')
      .classList.add('visibility--hidden');
  }

  private getSongListItemTpl(song: ISong) {
    return `
      <li class="songs__item">
        ${song.name}
        <button class="songs__item__delete" data-id="${song.id}">Delete</button>
      </li>`;
  }
}
