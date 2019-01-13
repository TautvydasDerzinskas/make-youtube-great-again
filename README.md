<p align="center">
  <a href="https://github.com/SlimDogs/make-youtube-great-again"><img src="docs/images/popup.gif" alt="Chrome extension: Make YouTube great again!" title="Chrome extension: Make YouTube great again!" width="250px" /></a>
</p>

<p align="center">
  <a href="#" target="_blank"><img src="https://travis-ci.org/SlimDogs/make-youtube-great-again.svg?branch=master" alt="Latest CI build status" title="Latest CI build status"></a>
  <a href="https://greenkeeper.io" target="_blank"><img src="https://badges.greenkeeper.io/SlimDogs/make-youtube-great-again.svg" alt="Greenkeeper" title="Greenkeeper"></a>
  <a href="http://commitizen.github.io/cz-cli" target="_blank"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly" title="Commitizen friendly"></a>
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

## About
_First of all please have in mind that extension name "Make YouTube great again" is chosen only because it sounds funny! Please don't look for any hidden political message - there is none._

Make YouTube Great Again is a Chrome extension which extends YouTube websites user interface with additional [features](#features). User don't have to use all of the extensions features as there is an option to toggle each of them on and off. There is also a history tab which shows how many times and on what YouTube videos those features been used.

## Installation
Currently you can only use this extension with Google Chrome web browser.
To install it please visit a Chrome web store page by clicking image below:

<a href="https://chrome.google.com/webstore/detail/make-youtube-great-again/geonnhfmhfjfkbbkjmbanmjommkjlnim" target="_blank">
  <img src="docs/images/chrome_store.png" alt="Convert videos to mp3" />
</a>

## Features

<p align="center">
  <strong>Convert videos to mp3</strong>
  <p align="center">
  <img src="docs/images/feature_01.gif" width="250px" alt="Convert videos to mp3" />
  </p>
</p>
Adds button under each YouTube video which provides an option to convert it to downloadable mp3 file.
It's users responsibility to use this feature only on videos which have free, non-copyrighted soundtracks.

____

<p align="center">
  <strong>Loop videos</strong>
  <p align="center">
  <img src="docs/images/feature_02.gif" width="250px" alt="Loop videos" />
  </p>
</p>
Adds button under each YouTube video which when activated enables video looping.
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
4. Run `npm run build` to compile the code and generate extension source folder
5. In your browser extensions window enable development mode and load MYGA extension from folder `extension` to test your changes

## License
The repository code is open-sourced software licensed under the [MIT license](https://github.com/SlimDogs/make-youtube-great-again/blob/master/LICENSE?raw=true).