import IMeta from './meta';
import IContent from './content';

export interface IBaseSongsFeatureData {
  songs?: string[];
  counter?: number;
}

export interface IFeatureStoredData<T> {
  status: boolean;
  data: T;
}

export interface IFeaturesStorageObject<T> {
  [index: string]: IFeatureStoredData<T>;
}

interface IFeature<T> {
  meta: IMeta<T>;
  content: IContent;
}

export default IFeature;
