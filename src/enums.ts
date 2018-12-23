export enum ApiKeys {
  DataApiV3 = 'AIzaSyDPqzqoI_iHEwfKSTzSrn0uri7DGUfKMU0',
  Analytics = 'UA-131052445-1',
}

export enum YoutubeSelectors {
  VideoPlayer = '.video-stream.html5-main-video',
  MenuAfterDropdown = '#menu-container > #menu > ytd-menu-renderer',
  MenuBeforeDropdown = '#menu-container > #menu #top-level-buttons',
  VideoTitle = '.title.style-scope.ytd-video-primary-info-renderer',
  // tslint:disable:max-line-length
  AllThumbnails = 'a.video-thumb:not(.myga-thumb-container), a.yt-uix-simple-thumb-wrap:not(.myga-thumb-container), a.ytp-videowall-still:not(.myga-thumb-container), a.pl-header-thumb:not(.myga-thumb-container), a#thumbnail:not(.ytd-moving-thumbnail-renderer):not(.ytd-movie-upsell-renderer):not(.myga-thumb-container), a#thumbnail-container:not(.myga-thumb-container)'
  // tslint:enable:max-line-length
}

export enum SvgIcons {
  DownloadMp3,
  Looper,
  Progress,
  Thumb,
}

export enum ShareLinks {
  Facebook = 'https://www.facebook.com/sharer/sharer.php?u=',
  Twitter = 'https://twitter.com/intent/tweet?text=Make%20YouTube%20great%20again&url=',
}
