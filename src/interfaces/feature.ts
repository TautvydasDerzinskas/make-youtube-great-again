import IMeta from './meta';
import IContent from './content';
import IPopup from './popup';

import { ProgressBars } from '../enums';

export interface IFeatureData {
  [index: string]: any;
  songs?: string[];
  counter?: number;
  theme?: ProgressBars;
  size?: number;
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
}

export default IFeature;
