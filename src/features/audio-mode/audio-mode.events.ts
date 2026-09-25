/**
 * The content script (isolated world) tells the page script (page's world,
 * where YouTube™'s player API lives) which videos should play as audio
 */
export const AUDIO_MODE_STATE_EVENT = 'myga-audio-mode:state';

export interface IAudioModeState {
  enabled: boolean;
  audioTracks: string[];
}

/**
 * The content script asks the page script for all video IDs of a playlist:
 * only the page's world has YouTube™'s API config (ytcfg) to fetch them
 */
export const AUDIO_MODE_PLAYLIST_REQUEST_EVENT = 'myga-audio-mode:playlist-request';
export const AUDIO_MODE_PLAYLIST_RESPONSE_EVENT = 'myga-audio-mode:playlist-response';

export interface IPlaylistVideosRequest {
  requestId: string;
  listId: string;
}

export interface IPlaylistVideosResponse {
  requestId: string;
  videoIds?: string[];
  error?: string;
}
