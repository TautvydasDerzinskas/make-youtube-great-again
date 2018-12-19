import featureStorageService from './services/common/feature-storage.service';
import urlService from './services/common/url.service';

import { Features } from './features/features';
import { YoutubeSelectors } from './enums';

/**
 * Only start initializing content scripts
 * when YouTube is fully loaded
 */
const checkPageLoadStatus = () => {
  const videoPageElement = document.querySelector(YoutubeSelectors.MenuAfterDropdown);
  // const otherPagesElements = document.querySelector(YoutubeSelectors.AllThumbnails);
  if (document.readyState === 'complete' && (videoPageElement /*|| otherPagesElements*/)) {
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

      if (featureEnabled) {
        if (feature.content.extendPageUserInterface) {
          console.log('Setting up extendPageUserInterface', feature.meta.id);
          feature.content.extendPageUserInterface();
        }
        if (feature.content.setupEventListeners) {
          console.log('Setting up setupEventListeners', feature.meta.id);
          feature.content.setupEventListeners();
        }
        if (feature.content.setupCommunications) {
          console.log('Setting up setupCommunications', feature.meta.id);
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
let videoId = urlService.getQueryParameterByName('v', window.location.href);
const observeYoutubeTitle = () => {
  const titleObserver = new MutationObserver(() => {
    const newVideoId = urlService.getQueryParameterByName('v', window.location.href);

    if (videoId !== newVideoId) {
      videoId = newVideoId;
      titleObserver.disconnect();
      checkPageLoadStatus();
    }
  });
  titleObserver.observe(
    document.querySelector('head > title'),
    { subtree: true, characterData: true, childList: true },
  );
};
