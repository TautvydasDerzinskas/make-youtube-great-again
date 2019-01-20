import MetaDownloadMp3 from './download-mp3/meta';
import ContentDownloadMp3 from './download-mp3/content';
import PopupDownloadMp3 from './download-mp3/popup';

import MetaLooper from './looper/meta';
import ContentLooper from './looper/content';
import PopupLooper from './looper/popup';

import MetaThumbnailStats from './thumbnail-stats/meta';
import ContentThumbnailStats from './thumbnail-stats/content';
import PopupThumbnailStats from './thumbnail-stats/popup';

import MetaHideComments from './hide-comments/meta';
import ContentHideComments from './hide-comments/content';
import PopupHideComments from './hide-comments/popup';

import MetaCustomProgressBar from './custom-progress-bar/meta';
import ContentCustomProgressBar from './custom-progress-bar/content';
import PopupCustomProgressBar from './custom-progress-bar/popup';

import IFeature from '../interfaces/feature';
import IMeta from '../interfaces/meta';

export const Features: IFeature[] = [
  {
    meta: MetaDownloadMp3,
    content: ContentDownloadMp3,
    popup: PopupDownloadMp3,
  },
  {
    meta: MetaLooper,
    content: ContentLooper,
    popup: PopupLooper,
  },
  {
    meta: MetaThumbnailStats,
    content: ContentThumbnailStats,
    popup: PopupThumbnailStats,
  },
  {
    meta: MetaHideComments,
    content: ContentHideComments,
    popup: PopupHideComments,
  },
  {
    meta: MetaCustomProgressBar,
    content: ContentCustomProgressBar,
    popup: PopupCustomProgressBar,
  },
];

const FeaturesMeta: IMeta[] = [];
Features.forEach(feature => { FeaturesMeta.push(feature.meta); });
export { FeaturesMeta };
