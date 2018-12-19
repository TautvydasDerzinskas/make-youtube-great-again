import featureStorageService from './services/common/feature-storage.service';
import urlService from './services/common/url.service';
import { Features } from './features/features';

let videoId = urlService.getQueryParameterByName('v', window.location.href);

const setupFeatureContents = () => {
  Features.forEach((feature, index) => {
    featureStorageService.getFeature(feature.meta.id).then(featureEnabled => {
      if (featureEnabled) {
        feature.content.extendPageUserInterface().then(() => {
          feature.content.setupEventListeners().then(() => {
            feature.content.setupCommunications().then(() => {
              if (index === (Features.length - 1)) {
                const titleObserver = new MutationObserver(() => {
                  const newVideoId = urlService.getQueryParameterByName('v', window.location.href);

                  if (videoId !== newVideoId) {
                    videoId = newVideoId;
                    titleObserver.disconnect();
                    setupFeatureContents();
                  }
                });
                titleObserver.observe(
                  document.querySelector('head > title'),
                  { subtree: true, characterData: true, childList: true },
                );
              }
            });
          });
        });
      }
    });
  });
};

setupFeatureContents();
