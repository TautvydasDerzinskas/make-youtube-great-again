import urlService from '../../services/common/url.service';
import Meta from './meta';
import MetaProviders from './providers/providers';
import { YoutubeSelectors } from '../../enums';
import IContent from '../../interfaces/content';

import './styles/download-mp3.scss';

class ContentDownloadMp3 implements IContent {
  get icon() {
    // tslint:disable:max-line-length
    return `
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980.000000 914.000000" preserveAspectRatio="xMidYMid meet">
     <g transform="translate(0.000000,914.000000) scale(0.100000,-0.100000)" stroke="none">
       <path d="M515 9110 c-95 -25 -138 -44 -217 -97 -94 -62 -171 -150 -224 -258 -81 -163 -74 228 -74 -4185 0 -4413 -7 -4022 74 -4185 80 -161 211 -277 385 -339 l86 -31 2665 0 2665 0 82 28 c200 68 357 225 430 432 l28 80 3 402 3 403 -1603 2 -1603 3 -97 27 c-366 101 -621 355 -720 719 l-23 84 0 1360 0 1360 22 81 c78 294 257 517 521 650 78 39 205 80 292 94 42 6 618 10 1638 10 l1572 0 0 340 0 340 -883 0 c-851 0 -887 1 -963 20 -132 33 -216 81 -315 179 -70 70 -94 102 -127 171 -76 156 -72 81 -72 1267 l0 1063 -1737 -1 c-1663 0 -1741 -1 -1808 -19z"/>
       <path d="M4390 8113 c0 -718 3 -1038 11 -1075 23 -105 82 -183 181 -235 l53 -28 888 -3 c488 -1 887 0 887 3 0 5 -1960 2295 -2006 2345 -12 12 -14 -143 -14 -1007z"/>
       <path d="M3197 5389 c-227 -64 -395 -233 -469 -469 l-23 -75 0 -1285 c0 -1202 1 -1289 18 -1350 68 -249 249 -429 494 -490 77 -20 119 -20 3063 -18 l2985 3 73 27 c204 74 354 224 426 427 l31 86 0 1305 0 1305 -23 75 c-36 114 -86 195 -176 286 -64 64 -99 90 -166 122 -161 79 137 72 -3185 71 -2921 0 -2981 -1 -3048 -20z m772 -1156 l253 -508 254 508 254 507 170 0 170 0 0 -1185 0 -1185 -170 0 -170 0 -1 843 0 842 -167 -332 -167 -333 -170 0 -170 0 -165 330 -165 330 -5 -837 -5 -838 -167 -3 -168 -2 0 1185 0 1185 168 0 167 0 254 -507z m2656 474 c108 -38 175 -78 252 -150 146 -137 216 -295 216 -492 1 -304 -183 -552 -483 -651 -48 -16 -105 -19 -460 -24 l-405 -5 -3 -507 -2 -508 -165 0 -165 0 0 1186 0 1185 568 -3 567 -3 80 -28z m1952 18 c124 -23 249 -90 342 -184 85 -85 130 -155 169 -263 24 -66 27 -86 27 -213 0 -135 -2 -143 -33 -221 -34 -85 -88 -170 -154 -242 l-39 -42 65 -79 c124 -153 171 -287 164 -466 -10 -220 -112 -402 -293 -524 -155 -104 -263 -125 -595 -118 -208 4 -243 7 -305 27 -122 39 -203 88 -291 175 -115 115 -178 248 -198 423 l-7 52 169 0 169 0 12 -66 c22 -120 78 -195 180 -243 54 -25 63 -26 281 -29 309 -5 376 11 463 107 114 126 106 362 -15 478 -18 18 -60 44 -93 60 -59 27 -65 28 -272 31 l-213 4 0 163 0 162 208 5 c180 5 214 8 263 27 110 42 179 130 198 252 26 162 -43 304 -178 368 -55 25 -61 26 -296 29 -277 4 -328 -4 -410 -66 -61 -46 -109 -133 -119 -215 l-7 -57 -167 2 -167 3 3 45 c6 89 24 156 68 248 92 191 283 337 487 371 92 15 496 13 584 -4z"/>
       <path d="M5742 4063 l3 -338 315 -3 c354 -3 455 5 528 42 63 32 126 103 149 169 26 77 24 207 -5 271 -46 101 -101 150 -202 180 -45 13 -115 16 -422 16 l-368 0 2 -337z"/>
     </g>
   </svg>
    `;
    // tslint:enable:max-line-length
  }

  public extendPageUserInterface() {
    this.cleanUp();

    document.getElementsByTagName('body')[0].classList.add('myga-download-mp3--enabled');

    const appendTo = document.querySelector(YoutubeSelectors.MenuBeforeDropdown);
    const dropdownHtml = `
      <button class="dropbtn myga-download-mp3-btn">${this.icon}</button>
      <div class="myga-dropdown-content">
        ${this.generateDropdownTemplate()}
      </div>
    `;

    const $button = document.createElement('div');
    $button.className = 'myga-dropdown';
    $button.setAttribute('title', Meta.description);
    $button.innerHTML = dropdownHtml;
    appendTo.appendChild($button);
  }

  private generateDropdownTemplate() {
    const videoId = urlService.getQueryParameterByName('v', window.location.href);

    let dropdownHtml = '';
    MetaProviders.forEach(meta => {
      const attachUrl = meta.withHash ? '#' + videoId : window.location.href;
      dropdownHtml += `
        <a title="${meta.name}" target="_blank" href="${meta.url}${attachUrl}">
          Get mp3 (${meta.name})
        </a>
      `;
    });
    return dropdownHtml;
  }

  private cleanUp() {
    const $looperButtons = document.getElementsByClassName('myga-dropdown');
    if ($looperButtons.length > 0) {
      for (let i = 0, b = $looperButtons.length; i < b; i += 1) {
        $looperButtons[i].remove();
      }
    }
  }
}

export default new ContentDownloadMp3();
