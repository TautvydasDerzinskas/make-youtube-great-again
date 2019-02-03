import MetaDownloadMp3 from './download-mp3/meta';
import ContentDownloadMp3 from './download-mp3/content';

import MetaLooper from './looper/meta';
import ContentLooper from './looper/content';

import MetaThumbnailStats from './thumbnail-stats/meta';
import ContentThumbnailStats from './thumbnail-stats/content';

import MetaHideComments from './hide-comments/meta';
import ContentHideComments from './hide-comments/content';

import MetaCustomProgressBar from './custom-progress-bar/meta';
import ContentCustomProgressBar from './custom-progress-bar/content';

import MetaVideoPin from './video-pin/meta';
import ContentVideoPin from './video-pin/content';

import IFeature from '../interfaces/feature';
import IMeta from '../interfaces/meta';

export const Features: IFeature<any>[] = [
  {
    meta: MetaDownloadMp3,
    content: ContentDownloadMp3,
  },
  {
    meta: MetaLooper,
    content: ContentLooper,
  },
  {
    meta: MetaThumbnailStats,
    content: ContentThumbnailStats,
  },
  {
    meta: MetaHideComments,
    content: ContentHideComments,
  },
  {
    meta: MetaCustomProgressBar,
    content: ContentCustomProgressBar,
  },
  {
    meta: MetaVideoPin,
    content: ContentVideoPin,
  },
];

const FeaturesMeta: IMeta<any>[] = [];
Features.forEach(feature => { FeaturesMeta.push(feature.meta); });
export { FeaturesMeta };
