import { StorageKeys } from '../enums/storageEnums';
import ISong from '../interfaces/songInterface';

export default class HistoryService {
  constructor() {
    chrome.storage.sync.get([StorageKeys.Songs], (result) => {
      if (result == null || result[StorageKeys.Songs] == null) {
        this.storeSongs([]);
      }
    });
  }

  public addSong(song: ISong) {
    chrome.storage.sync.get([StorageKeys.Songs], (result) => {
      const songs: ISong[] = this.convertToJson(result[StorageKeys.Songs]);
      songs.push(song);
      this.storeSongs(songs);
    });
  }

  public removeSong(song: ISong) {
    chrome.storage.sync.get([StorageKeys.Songs], (result) => {
      const songs: ISong[] = this.convertToJson(result[StorageKeys.Songs]);
      for (let i = 0; i < songs.length; i += 1) {
        if (songs[i].id === song.id) {
            songs.splice(i, 1);
        }
      }
      this.storeSongs(songs);
    });
  }

  private storeSongs(songs: ISong[]) {
    chrome.storage.sync.set({ [StorageKeys.Songs]: this.convertToString(songs) }, () => {
      console.log('Currently stored', songs);
    });
  }

  private convertToString(jsonItem: object) {
    return JSON.stringify(jsonItem).trim();
  }

  private convertToJson(stringifiedObject: string) {
    return JSON.parse(stringifiedObject);
  }
}
