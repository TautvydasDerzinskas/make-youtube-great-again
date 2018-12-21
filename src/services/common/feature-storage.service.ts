
import ChromeStorageService from './chrome-storage.service';

import { FeaturesMeta } from '../../features/features';

interface IFeatureData<T> {
  data: {
    [index: string]: T;
  };
}

interface IFeatureStoredData<T> {
  status: boolean;
  data: IFeatureData<T>;
}

interface IFeaturesStorageObject<T> {
  [index: string]: IFeatureStoredData<T>;
}

class FeatureStorageService extends ChromeStorageService {
  private FEATURES_STORAGE_KEY = 'mygaFeatures';

  constructor() {
    super();
    this.initialize();
  }

  public getFeatures(): Promise<IFeaturesStorageObject<any>> {
    return this.getItem(this.FEATURES_STORAGE_KEY);
  }

  public getFeatureData<T>(featureId: string): Promise<IFeatureStoredData<T>> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject<T>) => {
        resolve(features[featureId]);
      });
    });
  }

  public toggleFeatureStatus(featureId: string, value?: boolean): Promise<IFeatureStoredData<any>> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject<any>) => {
        features[featureId].status = typeof value === 'boolean' ? value : !features[featureId].status;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  public storeFeatureData<T>(featureId: string, data: IFeatureData<T>): Promise<IFeatureStoredData<T>> {
    return new Promise((resolve) => {
      this.getFeatures().then((features: IFeaturesStorageObject<T>) => {
        features[featureId].data = data;
        this.setItem(this.FEATURES_STORAGE_KEY, features).then(() => {
          resolve(features[featureId]);
        });
      });
    });
  }

  private initialize(): void {
    this.getFeatures().then((features: IFeaturesStorageObject<any>) => {
      if (features == null) {
        const freshFeatures: IFeaturesStorageObject<any> = {};

        FeaturesMeta.forEach(featureMeta => {
          freshFeatures[featureMeta.id] = {
            status: featureMeta.defaultStatus || true,
            data: featureMeta.defaultData || {},
          };
        });

        this.setItem(this.FEATURES_STORAGE_KEY, freshFeatures);
      }
    });
  }
}

export default new FeatureStorageService();
