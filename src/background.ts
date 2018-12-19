
import extensionService from './services/background/extension.service';
import analyticsService from './services/common/analytics.service';

analyticsService.initialize();

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

const gitRepoUrl = 'https://github.com/SlimDogs/make-youtube-great-again';
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason = 'install') {
    analyticsService.trackPageView('install');
    chrome.tabs.create({
      url: `${gitRepoUrl}/blob/master/docs/INSTALLED.md`
    });
  }
});
chrome.runtime.setUninstallURL(`${gitRepoUrl}/blob/master/docs/UNINSTALLED.md`, () => {
  analyticsService.trackPageView('uninstall');
});
