import IMeta from './meta';
import IContent from './content';
import IPopup from './popup';

export interface IFeatureData {
  songs?: string[];
  counter?: number;
  theme?: string;
}

export interface IFeatureStoredData {
  status: boolean;
  data: IFeatureData;
}

export interface IFeaturesStorageObject {
  [index: string]: IFeatureStoredData;
}

interface IFeature {
  meta: IMeta;
  content: IContent;
  popup: IPopup;
}

export default IFeature;
