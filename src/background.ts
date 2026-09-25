import extensionService from './services/background/extension.service';
import featureStorageService from './services/common/feature-storage.service';

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

chrome.runtime.onInstalled.addListener(() => {
  featureStorageService.initialize();
});
chrome.runtime.onStartup.addListener(() => {
  featureStorageService.initialize();
});
chrome.runtime.setUninstallURL('https://github.com/TautvydasDerzinskas/make-youtube-great-again');
