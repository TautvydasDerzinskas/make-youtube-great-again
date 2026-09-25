import { Browsers } from '../enums';

export default interface IMeta<T> {
  id: string;
  description: string;
  title: string;
  isInHistoryTab: boolean;
  actionTitle?: string;
  defaultStatus?: boolean;
  defaultData?: T;
  videoPageOnly?: boolean;
  hasSettings?: boolean;
  releaseDate?: string;
  disabledBrowsers?: Browsers[];
  /**
   * Always runs, whatever its stored status, & isn't listed in the popup's features
   */
  alwaysOn?: boolean;
  /**
   * Data the feature collected (e.g. screenshots): the popup shows an icon opening
   * its view (route "/settings/<id>") while the feature is on & there's any data
   */
  dataView?: {
    title: string;
    hasData(): Promise<boolean>;
    /** Returns a function removing the listener */
    onChange(listener: () => void): () => void;
  };
}
