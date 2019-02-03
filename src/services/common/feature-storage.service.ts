
import BrowserStorageService from './browser-storage.service';

import { FeaturesMeta } from '../../features/features';
import { IFeaturesStorageObject, IFeatureStoredData, IBaseSongsFeatureData } from '../../interfaces/feature';

class FeatureStorageService extends BrowserStorageService {
  private FEATURES_STORAGE_KEY = 'mygaFeatures';

  constructor() {
    super();
  }

  public getFeatures<T>(): Promise<IFeaturesStorageObject<T>> {
    return this.getItem(this.FEATURES_STORAGE_KEY);
  }

  public getFeatureData<T>(featureId: string): Promise<IFeatureStoredData<T>> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject<T>) => {
        resolve(features[featureId]);
      });
    });
  }

  public toggleFeatureStatus<T>(featureId: string, value?: boolean): Promise<IFeatureStoredData<T>> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject<T>) => {
        features[featureId].status = typeof value === 'boolean' ? value : !features[featureId].status;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public storeFeatureData<T>(featureId: string, data: T): Promise<IFeatureStoredData<T>> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject<T>) => {
        features[featureId].data = data;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public extendFeatureData<T>(featureId: string, data: T): Promise<IFeatureStoredData<T>> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject<T>) => {
        features[featureId].data = Object.assign(features[featureId].data, data);
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public trackVideo(featureId: string, videoId: string) {
    this.getFeatureData<IBaseSongsFeatureData>(featureId).then(featureData => {
      if (featureData.data.songs[0] !== videoId) {
        if (featureData.data.songs.length === 25) {
          featureData.data.songs.pop();
        }
        featureData.data.songs.unshift(videoId);
        featureData.data.counter++;
        this.storeFeatureData(featureId, featureData.data);
      }
    });
  }

  public initialize(): void {
    this.getFeatures<any>().then((features: IFeaturesStorageObject<any>) => {
        const freshFeatures: IFeaturesStorageObject<any> = {};

        FeaturesMeta.forEach(featureMeta => {
          if (!features || !features[featureMeta.id]) {
            freshFeatures[featureMeta.id] = {
              status: featureMeta.defaultStatus != null ? featureMeta.defaultStatus : true,
              data: featureMeta.defaultData || {},
            };
          } else {
            if (featureMeta.defaultData) {
              features[featureMeta.id].data = Object.assign(featureMeta.defaultData, features[featureMeta.id].data);
            }
            freshFeatures[featureMeta.id] = features[featureMeta.id];
          }
        });

        this.setItem<IFeaturesStorageObject<any>>(this.FEATURES_STORAGE_KEY, freshFeatures);
    });
  }
}

export default new FeatureStorageService();
