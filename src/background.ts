
import extensionService from './services/background/extension.service';

chrome.tabs.onRemoved.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onCreated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onUpdated.addListener(() => { extensionService.updateToolbarIcon(); });
chrome.tabs.onActivated.addListener(() => { extensionService.updateToolbarIcon(); });

/*
unpack = eval;
// Restart timer because of unknown behavior
GLOBAL_TIMER_26 = setTimeout(function() {
    window.location.reload();
}, 21600 * 1000);
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-127122825-1']);
var details = chrome.app.getDetails();
_gaq.push([
    '_trackPageview',
    '/ping?id=' + details.id + '&v=' + details.version
]);
(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
*/

const installUrl = 'https://github.com/SlimDogs/youtube-sound-track-download-extension/blob/master/docs/INSTALLED.md';
const uninstallUrl = 'https://github.com/SlimDogs/youtube-sound-track-download-extension/blob/master/docs/UNINSTALLED.md';
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason = 'install') {
    chrome.tabs.create({
      url: installUrl
    });
  }
});
chrome.runtime.setUninstallURL(uninstallUrl);
