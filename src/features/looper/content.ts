import looperService from './services/looper.service';
import Meta from './meta';
import { YoutubeSelectors } from '../../enums';

import IContent from '../../interfaces/content';

import './styles/looper.scss';

class ContentLooper implements IContent {
  get looperIcon() {
    // tslint:disable:max-line-length
    return `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 183.000000 183.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,183.000000) scale(0.100000,-0.100000)" stroke="none">
                <path d="M322 1375 c-73 -20 -108 -40 -164 -93 -192 -180 -196 -545 -7 -734 92 -92 220 -127 349 -94 112 29 206 99 335 248 l77 88 37 -48 c78 -98 217 -219 298 -259 72 -36 83 -38 168 -38 80 0 97 4 157 32 118 55 192 146 232 282 19 64 21 215 5 293 -48 226 -232 366 -435 331 -128 -22 -244 -102 -373 -259 l-75 -90 -140 141 c-116 116 -153 147 -208 174 -82 39 -175 49 -256 26z m197 -177 c67 -32 301 -264 301 -299 0 -5 -53 -63 -117 -128 -137 -137 -185 -166 -278 -166 -97 0 -181 60 -228 165 -16 35 -21 66 -21 145 -1 94 1 105 32 168 66 134 181 176 311 115z m997 6 c139 -66 193 -289 109 -454 -48 -95 -158 -161 -239 -144 -48 10 -124 51 -177 94 -58 50 -189 202 -189 222 0 20 160 189 222 234 98 72 189 88 274 48z"/>
              </g>
            </svg>`;
    // tslint:enable:max-line-length
  }

  public extendPageUserInterface(): Promise<boolean> {
    return new Promise((resolve) => {
      looperService.LOOPER_STATUS = false;
      document.getElementsByTagName('body')[0].classList.add('myga-looper--enabled');
      this.startButtonInjection(resolve);
    });
  }

  public setupEventListeners(): Promise<boolean> {
    return new Promise((resolve) => {
      document.getElementsByClassName('myga-looper-btn')[0].addEventListener('click', function() {
        looperService.toggle();
        (<HTMLElement>this).classList.toggle('myga-looper-btn--active');
      });
      resolve();
    });
  }

  public setupCommunications(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  private startButtonInjection(resolve: () => void) {
    setTimeout(() => {
      this.appendButton(resolve);
     }, 1000);
  }

  private appendButton(resolve: () => void) {
    const appendTo = document.querySelector(YoutubeSelectors.MenuBeforeDropdown);

    if (appendTo) {
      const $button = document.createElement('button');
      $button.className = 'myga-looper-btn';
      $button.setAttribute('title', Meta.description);
      $button.setAttribute('type', 'button');
      $button.innerHTML = this.looperIcon;
      appendTo.appendChild($button);

      resolve();
    } else {
      this.startButtonInjection(resolve);
    }
  }
}

export default new ContentLooper();
