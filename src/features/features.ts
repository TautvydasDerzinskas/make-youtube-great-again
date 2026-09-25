import MetaViewHistory from './view-history/meta';
import ContentViewHistory from './view-history/content';

import MetaLooper from './looper/meta';
import ContentLooper from './looper/content';

import MetaHideComments from './hide-comments/meta';
import ContentHideComments from './hide-comments/content';

import MetaCustomProgressBar from './custom-progress-bar/meta';
import ContentCustomProgressBar from './custom-progress-bar/content';

import MetaVideoPin from './video-pin/meta';
import ContentVideoPin from './video-pin/content';

import MetaScreenshots from './screenshots/meta';
import ContentScreenshots from './screenshots/content';

import MetaCinemaMode from './cinema-mode/meta';
import ContentCinemaMode from './cinema-mode/content';

import MetaCommentDrafts from './comment-drafts/meta';
import ContentCommentDrafts from './comment-drafts/content';

import MetaAudioMode from './audio-mode/meta';
import ContentAudioMode from './audio-mode/content';

import MetaHideThanks from './hide-thanks/meta';
import ContentHideThanks from './hide-thanks/content';

import IFeature from '../interfaces/feature';

export const Features: IFeature<any>[] = [
  {
    meta: MetaViewHistory,
    content: ContentViewHistory,
  },
  {
    meta: MetaLooper,
    content: ContentLooper,
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
  {
    meta: MetaScreenshots,
    content: ContentScreenshots,
  },
  {
    meta: MetaCinemaMode,
    content: ContentCinemaMode,
  },
  {
    meta: MetaCommentDrafts,
    content: ContentCommentDrafts,
  },
  {
    meta: MetaAudioMode,
    content: ContentAudioMode,
  },
  {
    meta: MetaHideThanks,
    content: ContentHideThanks,
  },
];
