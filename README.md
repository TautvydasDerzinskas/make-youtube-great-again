<p align="center">
  <a href="https://github.com/SlimDogs/make-youtube-great-again"><img src="docs/images/myga_promo_440x280.jpg" alt="Browser extension: Make YouTube great again!" title="Browser extension: Make YouTube™ great again!" width="250px" /></a>
</p>

<p align="center">
  <a href="#" target="_blank"><img src="https://travis-ci.org/SlimDogs/make-youtube-great-again.svg?branch=master" alt="Latest CI build status" title="Latest CI build status"></a>
  <a href="https://github.com/SlimDogs/make-youtube-great-again" target="_blank"><img src="https://img.shields.io/chrome-web-store/users/geonnhfmhfjfkbbkjmbanmjommkjlnim.svg?label=users" alt="Active users" title="Active users"></a>
  <a href="https://greenkeeper.io" target="_blank"><img src="https://badges.greenkeeper.io/SlimDogs/make-youtube-great-again.svg" alt="Greenkeeper" title="Greenkeeper"></a>
  <a href="http://commitizen.github.io/cz-cli" target="_blank"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly" title="Commitizen friendly"></a>
  <a href="https://github.com/semantic-release/semantic-release" target="_blank"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Semantic release" title="Semantic release"></a>
  <a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" title="MIT License"></a>
  <a href="https://github.com/igrigorik/ga-beacon" target="_blank"><img src="https://ga-beacon.appspot.com/UA-131052445-2/SlimDogs/make-youtube-great-again" alt="Analytics" title="Analytics"></a>
</p>

## Table of content
- [About](#about)
- [Installation](#installation)
- [Features](#features)
- [Screenshots](#screenshots)
- [Road map](#road-map)
- [Development](#development)
- [License](#license)
- [Changelog](CHANGELOG.md)

## About
_First of all please have in mind that extension name "Make YouTube™ great again" is chosen only because it sounds funny! Please don't look for any hidden political message - there is none._

Make YouTube™ Great Again is a Browser extension which extends YouTube websites user interface with additional [features](#features). User don't have to use all of the extensions features as there is an option to toggle each of them on and off. There is also a history tab which shows how many times and on what YouTube™ videos those features been used.

## Installation
Chrome & Vivaldi users please click below:

<a href="https://chrome.google.com/webstore/detail/make-youtube-great-again/geonnhfmhfjfkbbkjmbanmjommkjlnim" target="_blank">
  <img src="docs/images/chrome_store.png" alt="Chrome Web Store" />
</a>

Firefox users please head to link below:

<a href="https://addons.mozilla.org/en-GB/firefox/addon/myga/" target="_blank">
  <img src="docs/images/firefox_store.png" width="206px" alt="Firefox add-ons" />
</a>

## Features

<p align="center">
  <strong>Loop videos</strong>
  <p align="center">
  <img src="docs/images/feature_02.gif" width="250px" alt="Loop videos" />
  </p>
</p>
Adds button under each YouTube™ video which when activated enables video looping.
This works fine with both new HTML5 player and legacy flash player.

____

<p align="center">
  <strong>Preview like stats on video thumbnails</strong>
  <p align="center">
  <img src="docs/images/feature_03.gif" width="250px" alt="Preview like stats on video thumbnails" />
  </p>
</p>
Allows user to see how many times video was liked/disliked before getting to actual video clip page.
Once user hovers video thumbnail it adds a like/dislike indicator.

____

<p align="center">
  <strong>Hide comments</strong>
  <p align="center">
  <img src="docs/images/feature_04.gif" width="250px" alt="Hide comments" />
  </p>
</p>
Sometimes it's nice to hide the comments... This feature does exactly that.
It hides both normal comments and live chat messages.

____

<p align="center">
  <strong>Custom progress bar</strong>
  <p align="center">
  <img src="docs/images/feature_05.gif" width="250px" alt="Custom progress barr" />
  </p>
</p>
Have a custom and nice looking playback progress bar!

____

<p align="center">
  <strong>Floating video</strong>
  <p align="center">
  <img src="docs/images/feature_06.gif" width="250px" alt="Custom progress barr" />
  </p>
</p>
Don't miss a second of your YouTube™ video even when reading comments!

## Screenshots
<a href="docs/images/screenshot_01.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_01.jpg" alt="Screenshot" title="Screenshot" /></a><a href="docs/images/screenshot_02.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_02.jpg" alt="Screenshot" title="Screenshot" /></a><a href="docs/images/screenshot_03.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_03.jpg" alt="Screenshot" title="Screenshot" /></a><a href="docs/images/screenshot_04.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_04.jpg" alt="Screenshot" title="Screenshot" /></a><a href="docs/images/screenshot_05.jpg" target="_blank"><img width="200px" src="docs/images/screenshot_05.jpg" alt="Screenshot" title="Screenshot" /></a>



## Road map
* Port extension to browsers such as Firefox and Opera
* Add more features

## Development
Everyone is welcomed to contribute to the project or use the code for their own projects

To contribute you need to perform these steps:
1. Run `npm install` to install npm dependencies
2. Apply your changes and modifications
3. Run `npm run lint` to make sure code is well formatted
4. Run `npm run build:chrome` to compile the code and generate extension source folder
5. In your browser extensions window enable development mode and load MYGA extension from folder `extension` to test your changes

## License
The repository code is open-sourced software licensed under the [MIT license](https://github.com/SlimDogs/make-youtube-great-again/blob/master/LICENSE?raw=true).