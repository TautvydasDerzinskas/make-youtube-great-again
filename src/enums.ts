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

export enum ShareLinks {
  Facebook = 'https://www.facebook.com/sharer/sharer.php?u=',
  Twitter = 'https://twitter.com/intent/tweet?text=Make%20YouTube%20great%20again&url=',
}

export enum Browsers {
  Chrome = 'chrome',
  Firefox = 'firefox',
  Opera = 'opera',
  Vivaldi = 'vivaldi',
  Other = 'other',
}

export enum ProgressBars {
  Zombie = 'zombie',
  NyanCat = 'nyan-cat',
  Football = 'football',
  Pacman = 'pacman',
  Poop = 'poop',
  Purge = 'purge',
  WarCrab = 'war-crab',
  Orcs = 'orcs',
  Unicorn = 'unicorn',
  Panda = 'panda',
}
