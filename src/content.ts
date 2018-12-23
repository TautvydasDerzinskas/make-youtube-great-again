import featureStorageService from './services/common/feature-storage.service';
import urlService from './services/common/url.service';

import { Features } from './features/features';
import { IMessageToggle } from './interfaces/communication';
import { YoutubeSelectors } from './enums';

let videoId = urlService.getQueryParameterByName('v');
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
    featureStorageService.getFeatureData(feature.meta.id).then(featureData => {
      featuresLoaded--;

      if (featureData.status && (!feature.meta.videoPageOnly || isUrlVideoPage)) {
        if (feature.content.extendPageUserInterface) {
          feature.content.extendPageUserInterface();
        }
        if (feature.content.setupEventListeners) {
          feature.content.setupEventListeners();
        }
      }

      if (featuresLoaded === 0) { observeYoutubeTitle(); }
    });
  });
};

/**
 * Settup feature toggling listener
 */
chrome.runtime.onMessage.addListener((request: IMessageToggle) => {
  if  (request.toggle && request.toggle.featureId) {
    const activeFeature = Features.filter(feature => feature.meta.id === request.toggle.featureId)[0];
    if (activeFeature) {
      if (request.toggle.value) {
        if (activeFeature.content.extendPageUserInterface) {
          activeFeature.content.extendPageUserInterface();
        }
        if (activeFeature.content.setupEventListeners) {
          activeFeature.content.setupEventListeners();
        }
      } else {
        activeFeature.content.cleanUp();
      }
    }
  }
});

/**
 * Observe for ajax page reload event
 */
const observeYoutubeTitle = () => {
  const titleObserver = new MutationObserver(() => {
    const newVideoId = urlService.getQueryParameterByName('v', window.location.href);

    if (videoId !== newVideoId) {
      videoId = newVideoId;
      isUrlVideoPage = videoId != null;

      if (isUrlVideoPage) {
        titleObserver.disconnect();
        checkPageLoadStatus();
      }
    }
  });
  titleObserver.observe(
    document.querySelector('head > title'),
    { subtree: true, characterData: true, childList: true },
  );
};
