import MetaViewHistory from './view-history/meta';
import MetaLooper from './looper/meta';
import MetaHideComments from './hide-comments/meta';
import MetaCustomProgressBar from './custom-progress-bar/meta';
import MetaVideoPin from './video-pin/meta';
import MetaChannelBlacklist from './channel-blacklist/meta';
import MetaScreenshots from './screenshots/meta';
import MetaCinemaMode from './cinema-mode/meta';
import MetaCommentDrafts from './comment-drafts/meta';
import MetaAudioMode from './audio-mode/meta';
import MetaHideThanks from './hide-thanks/meta';

import IMeta from '../interfaces/meta';

/**
 * Metadata only (no content scripts or styles) so it
 * can be safely imported by the background service worker
 */
export const FeaturesMeta: IMeta<any>[] = [
  MetaViewHistory,
  MetaLooper,
  MetaHideComments,
  MetaCustomProgressBar,
  MetaVideoPin,
  MetaChannelBlacklist,
  MetaScreenshots,
  MetaCinemaMode,
  MetaCommentDrafts,
  MetaAudioMode,
  MetaHideThanks,
];
