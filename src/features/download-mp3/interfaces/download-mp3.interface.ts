import { IBaseSongsFeatureData } from '../../../interfaces/feature';

export interface IDownloadMp3Data extends IBaseSongsFeatureData {
  flvto: boolean;
  savemp3: boolean;
  onlinevideoconverter: boolean;
  simpleyoutubeconverter: boolean;
}
