import CoreService from './services/coreService';

const coreService = new CoreService();

chrome.tabs.onRemoved.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onCreated.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onUpdated.addListener(() => { coreService.setExtensionIcon(); });
chrome.tabs.onActivated.addListener(() => { coreService.setExtensionIcon(); });
