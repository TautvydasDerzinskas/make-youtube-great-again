import featureStorageService from './services/common/feature-storage.service';
import urlService from './services/common/url.service';

import { Features } from './features/features';
import { YoutubeSelectors } from './enums';

let videoId = urlService.getQueryParameterByName('v', window.location.href);
let isUrlVideoPage = videoId != null;

/**
 * Only start initializing content scripts
 * when YouTube is fully loaded
 */
const checkPageLoadStatus = () => {
  const videoPageElement = document.querySelector(YoutubeSelectors.MenuAfterDropdown);
  const otherPagesElements = document.querySelector(YoutubeSelectors.AllThumbnails);
  if (document.readyState === 'complete' && (isUrlVideoPage && videoPageElement || !isUrlVideoPage && otherPagesElements)) {
    setupFeatureContents();
  } else {
    setTimeout(checkPageLoadStatus, 500);
  }
};
setTimeout(checkPageLoadStatus, 500);

/**
 * Initialize all the featues
 */
const setupFeatureContents = () => {
  let featuresLoaded = Features.length;
  Features.forEach((feature) => {
    featureStorageService.getFeature(feature.meta.id).then(featureEnabled => {
      featuresLoaded--;

      if (featureEnabled && (!feature.meta.videoPageOnly || isUrlVideoPage)) {
        if (feature.content.extendPageUserInterface) {
          feature.content.extendPageUserInterface();
        }
        if (feature.content.setupEventListeners) {
          feature.content.setupEventListeners();
        }
        if (feature.content.setupCommunications) {
          feature.content.setupCommunications();
        }
      }

      if (featuresLoaded === 0) { observeYoutubeTitle(); }
    });
  });
};

/**
 * Observe for ajax page reload event
 */
const observeYoutubeTitle = () => {
  const titleObserver = new MutationObserver(() => {
    const newVideoId = urlService.getQueryParameterByName('v', window.location.href);

    if (videoId !== newVideoId) {
      videoId = newVideoId;
      isUrlVideoPage = videoId != null;
      titleObserver.disconnect();
      checkPageLoadStatus();
    }
  });
  titleObserver.observe(
    document.querySelector('head > title'),
    { subtree: true, characterData: true, childList: true },
  );
};
