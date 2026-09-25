
import BrowserStorageService from './browser-storage.service';

import { FeaturesMeta } from '../../features/features-meta';
import { IFeaturesStorageObject, IFeatureStoredData, IBaseSongsFeatureData } from '../../interfaces/feature';

/**
 * Videos kept per feature in the History tab. Settings live in sync storage, which allows 8KB per item.
 */
const HISTORY_SIZE = 25;

class FeatureStorageService extends BrowserStorageService {
  private FEATURES_STORAGE_KEY = 'mygaFeatures';

  /**
   * Fills in defaults when settings are missing (e.g. storage just switched from sync to local),
   * so no part of the extension ever reads empty settings
   */
  public async getFeatures<T>(): Promise<IFeaturesStorageObject<T>> {
    const features = await this.getItem<IFeaturesStorageObject<T>>(this.FEATURES_STORAGE_KEY);
    if (!features || FeaturesMeta.some(featureMeta => !features[featureMeta.id])) {
      return this.initialize();
    }
    return features;
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

  /**
   * Moves the video to the top of the feature's history, listed once.
   * The counter only grows for videos not already on top, so reloading one doesn't count.
   */
  public trackVideo(featureId: string, videoId: string) {
    if (!videoId) {
      return;
    }

    this.getFeatureData<IBaseSongsFeatureData>(featureId).then(featureData => {
      const songs = featureData.data.songs || [];
      if (songs[0] === videoId) {
        return;
      }

      featureData.data.songs = [videoId, ...songs.filter(id => id !== videoId)].slice(0, HISTORY_SIZE);
      featureData.data.counter = (featureData.data.counter || 0) + 1;
      this.storeFeatureData(featureId, featureData.data);
    });
  }

  public initialize(): Promise<IFeaturesStorageObject<any>> {
    return this.getItem<IFeaturesStorageObject<any>>(this.FEATURES_STORAGE_KEY).then(async (features: IFeaturesStorageObject<any>) => {
        const freshFeatures: IFeaturesStorageObject<any> = {};

        FeaturesMeta.forEach(featureMeta => {
          if (!features || !features[featureMeta.id]) {
            freshFeatures[featureMeta.id] = {
              status: featureMeta.defaultStatus != null ? featureMeta.defaultStatus : true,
              data: { ...featureMeta.defaultData },
            };
          } else {
            if (featureMeta.defaultData) {
              // Copied, so the shared defaults never take on a user's data
              features[featureMeta.id].data = { ...featureMeta.defaultData, ...features[featureMeta.id].data };
            }
            freshFeatures[featureMeta.id] = features[featureMeta.id];
          }
        });

        await this.setItem<IFeaturesStorageObject<any>>(this.FEATURES_STORAGE_KEY, freshFeatures);
        return freshFeatures;
    });
  }
}

export default new FeatureStorageService();
