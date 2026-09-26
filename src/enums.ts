export enum YoutubeSelectors {
  VideoPlayer = '.video-stream.html5-main-video',
  ActionButtons = 'ytd-watch-metadata #actions ytd-menu-renderer #top-level-buttons-computed',
  VideoTitle = '.title.style-scope.ytd-video-primary-info-renderer',
  // Any video thumbnail: tells when YouTube™'s non-video pages (home, search, channels…) have loaded
  AllThumbnails = 'a#thumbnail, a.ytLockupViewModelContentImage, ytm-shorts-lockup-view-model-v2 a, a.ytp-videowall-still'
}

export enum Browsers {
  Chrome = 'chrome',
  Edge = 'edge',
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
  Horse = 'horse',
  Fire = 'fire',
  Moon = 'moon',
}
