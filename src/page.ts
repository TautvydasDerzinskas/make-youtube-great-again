/**
 * Runs in the page's own world (manifest "world": "MAIN"), where YouTube™'s player API lives.
 * Keep it small: no chrome.* APIs are available here.
 */
export { default as audioModePage } from './features/audio-mode/page';
export { default as playlistVideosPage } from './features/audio-mode/page-playlist';
export { default as accountPage } from './features/comment-drafts/page-account';
