
import StorageService from './storage.service';

import { FeaturesMeta } from '../../features/features';

interface IFeaturesStorageObject { [index: string]: boolean; }

class FeatureStorageService extends StorageService {
  private FEATURES_STORAGE_KEY = 'mygaFeatures';

  constructor() {
    super();
    this.initialize();
  }

  public getFeatures(): Promise<IFeaturesStorageObject> {
    return this.getItem(this.FEATURES_STORAGE_KEY);
  }

  public getFeature(featureId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        resolve(features[featureId]);
      });
    });
  }

  public toggleFeature(featureId: string, value?: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject) => {
        features[featureId] = typeof value === 'boolean' ? value : !features[featureId];
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  private initialize(): void {
    this.getFeatures().then((features: IFeaturesStorageObject) => {
      if (features == null) {
        const freshFeatures: IFeaturesStorageObject = {};

        FeaturesMeta.forEach(featureMeta => {
          freshFeatures[featureMeta.id] = featureMeta.defaultStatus || true;
        });

        this.setItem(this.FEATURES_STORAGE_KEY, freshFeatures);
      }
    });
  }
}

export default new FeatureStorageService();
