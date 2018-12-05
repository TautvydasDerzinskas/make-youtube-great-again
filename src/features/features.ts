import MetaDownloadMp3 from './download-mp3/meta';
import ContentDownloadMp3 from './download-mp3/content';
import PopupDownloadMp3 from './download-mp3/popup';

import IFeature from '../interfaces/feature';

const features: IFeature[] = [
  {
    meta: MetaDownloadMp3,
    content: ContentDownloadMp3,
    popup: PopupDownloadMp3,
  }
];

export default features;
