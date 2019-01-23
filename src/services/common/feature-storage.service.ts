
import BrowserStorageService from './browser-storage.service';

import { FeaturesMeta } from '../../features/features';
import { IFeaturesStorageObject, IFeatureStoredData, IFeatureData } from '../../interfaces/feature';

class FeatureStorageService extends BrowserStorageService {
  private FEATURES_STORAGE_KEY = 'mygaFeatures';

  constructor() {
    super();
  }

  public getFeatures(): Promise<IFeaturesStorageObject> {
    return this.getItem(this.FEATURES_STORAGE_KEY);
  }

  public getFeatureData<T>(featureId: string): Promise<IFeatureStoredData> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        features = this.checkFeatures(features, featureId);
        resolve(features[featureId]);
      });
    });
  }

  public toggleFeatureStatus(featureId: string, value?: boolean): Promise<IFeatureStoredData> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        features = this.checkFeatures(features, featureId);
        features[featureId].status = typeof value === 'boolean' ? value : !features[featureId].status;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public storeFeatureData<T>(featureId: string, data: IFeatureData): Promise<IFeatureStoredData> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        features = this.checkFeatures(features, featureId);
        features[featureId].data = data;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public trackVideo(featureId: string, videoId: string) {
    this.getFeatureData(featureId).then(featureData => {
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

  private getFeatureMetaById(featureId: string) {
    return FeaturesMeta.filter(feature => feature.id === featureId)[0];
  }

  private checkFeatures(features: IFeaturesStorageObject, featureId: string) {
    if (!features) {
      features = {};
    }

    if (!features[featureId]) {
      const featureMeta = this.getFeatureMetaById(featureId);
      features[featureId] = {
        status: featureMeta.defaultStatus != null ? featureMeta.defaultStatus : true,
        data: featureMeta.defaultData || {},
      };
    }

    return features;
  }
}

export default new FeatureStorageService();
