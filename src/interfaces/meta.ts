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
}
