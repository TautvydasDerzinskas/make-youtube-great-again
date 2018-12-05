import { StorageKeys } from '../enums/storageEnums';

export default class FeaturesService {
  constructor() {}

  public getFeatures() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([StorageKeys.Features], (result) => {
        const songs: ISong[] = this.convertToJson(result[StorageKeys.Songs]);
        resolve(songs);
      });
    });
  }

  public updateFeatures() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([StorageKeys.Features], (result) => {
        const songs: ISong[] = this.convertToJson(result[StorageKeys.Songs]);
        resolve(songs);
      });
    });
  }

  public updateFeature(featureId: string, value: boolean) {
    return new Promise((resolve) => {
      chrome.storage.sync.get([StorageKeys.Features], (result) => {
        const features = this.convertToJson(result[StorageKeys.Features]);
        features[featureId] = value;

        this.convertToString(features)
        resolve(features);
      });
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
