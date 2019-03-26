
import extensionService from './services/background/extension.service';
import analyticsService from './services/common/analytics.service';
import featureStorageService from './services/common/feature-storage.service';

analyticsService.initialize();
analyticsService.trackPageView('regular-run');

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason = 'install') {
    analyticsService.trackPageView('install');
  } else if (details.reason === 'update') {
    analyticsService.trackPageView('update');
  }
});
chrome.runtime.setUninstallURL('https://github.com/SlimDogs/make-youtube-great-again');

featureStorageService.initialize();
