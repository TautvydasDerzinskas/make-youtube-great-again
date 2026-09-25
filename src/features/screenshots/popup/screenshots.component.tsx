import * as React from 'react';
import { Navigate } from 'react-router';

import BackToFeaturesComponent from '../../../popup/tabs/features/settings/back-to-features/back-to-features.component';

import screenshotsService, { IScreenshot } from '../services/screenshots.service';
import MetaScreenshots from '../meta';

import './screenshots.component.scss';

interface IScreenshotsComponentState {
  screenshots: IScreenshot[];
  isLoaded: boolean;
}

export default class ScreenshotsComponent extends React.Component<{}, IScreenshotsComponentState> {
  private removeStorageListener: () => void;

  constructor(props: {}) {
    super(props);
    this.state = { screenshots: [], isLoaded: false };
  }

  componentDidMount() {
    this.loadScreenshots();
    this.removeStorageListener = screenshotsService.onChange(() => this.loadScreenshots());
  }

  componentWillUnmount() {
    this.removeStorageListener();
  }

  private loadScreenshots() {
    screenshotsService.getAll().then(screenshots => this.setState({ screenshots, isLoaded: true }));
  }

  /**
   * Full size, in a new tab. Blob URL: browsers block opening data URLs in tabs.
   */
  private async open(screenshot: IScreenshot) {
    const blob = await this.getImageBlob(screenshot);
    if (blob) {
      chrome.tabs.create({ url: URL.createObjectURL(blob) });
    }
  }

  private async download(screenshot: IScreenshot) {
    const blob = await this.getImageBlob(screenshot);
    if (!blob) {
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = screenshotsService.fileName(screenshot);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 10000);
  }

  private remove(screenshot: IScreenshot) {
    if (confirm('Delete this screenshot?')) {
      screenshotsService.remove(screenshot.id);
    }
  }

  private async getImageBlob(screenshot: IScreenshot) {
    const image = await screenshotsService.getImage(screenshot.id);
    return image ? (await fetch(image)).blob() : null;
  }

  render() {
    // Nothing left (e.g. the last one deleted): back to the features
    if (this.state.isLoaded && this.state.screenshots.length === 0) {
      return <Navigate to='/settings' replace />;
    }

    return (
      <>
      <BackToFeaturesComponent featureName={MetaScreenshots.title} />
      <div className='screenshots'>
        {this.state.screenshots.map(screenshot => (
          <div className='screenshots__item' key={screenshot.id}>
            <button type='button' className='screenshots__thumbnail' title='Open full size' onClick={() => this.open(screenshot)}>
              <img src={screenshot.thumbnail} alt='' />
              <span className='screenshots__size'>{screenshot.width}×{screenshot.height}</span>
            </button>
            <a className='screenshots__title' href={screenshotsService.videoUrl(screenshot)} target='_blank' title={`Open the video at ${screenshotsService.formatTime(screenshot.time)}`}>
              {screenshot.videoTitle}
            </a>
            <div className='screenshots__footer'>
              <a className='screenshots__time' href={screenshotsService.videoUrl(screenshot)} target='_blank' title='Open the video at this moment'>
                ▶ {screenshotsService.formatTime(screenshot.time)}
              </a>
              <div className='screenshots__actions'>
                <button type='button' className='screenshots__button' onClick={() => this.remove(screenshot)}>Delete</button>
                <button type='button' className='screenshots__button screenshots__button--primary' onClick={() => this.download(screenshot)}>Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </>
    );
  }
}
