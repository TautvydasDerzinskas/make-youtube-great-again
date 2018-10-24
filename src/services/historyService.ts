import { StorageKeys } from '../enums/storageEnums';
import ISong from '../interfaces/songInterface';

export default class HistoryService {
  public getSongs() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([StorageKeys.Songs], (result) => {
        const songs: ISong[] = this.convertToJson(result[StorageKeys.Songs]);
        resolve(songs);
      });
    });
  }

  public addSong(song: ISong) {
    chrome.storage.sync.get([StorageKeys.Songs], (result) => {
      const songs: ISong[] = this.convertToJson(result[StorageKeys.Songs]);
      songs.push(song);
      this.storeSongs(songs);
    });
  }

  public removeSong(songId: string) {
    chrome.storage.sync.get([StorageKeys.Songs], (result) => {
      const songs: ISong[] = this.convertToJson(result[StorageKeys.Songs]);
      for (let i = 0; i < songs.length; i += 1) {
        if (songs[i].id === songId) {
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
    try {
      return JSON.parse(stringifiedObject);
    } catch (exception) {
      return [];
    }
  }
}
