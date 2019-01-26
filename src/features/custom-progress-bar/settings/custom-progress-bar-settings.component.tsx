import * as React from 'react';
import { Tooltip } from 'react-tippy';
import BackToFeaturesComponent from '../../../popup/tabs/features/back-to-features/back-to-features.component';

import featureStorageService from '../../../services/common/feature-storage.service';

import MetaCustomProgressBar from '../meta';
import { IMessageRestart } from '../../../interfaces/communication';
import { ProgressBars } from '../../../enums';

import './custom-progress-bar-settings.component.scss';

interface ICustomProgressBarSettingsComponent {
  progressBarType: ProgressBars;
}

export default class CustomProgressBarSettingsComponent extends React.Component<{}, ICustomProgressBarSettingsComponent> {
  constructor(props: {}, state: ICustomProgressBarSettingsComponent) {
    super(props, state);
    this.state = {
      progressBarType: this.progressBarTypes[0],
    };
  }

  componentDidMount() {
    featureStorageService.getFeatureData(MetaCustomProgressBar.id).then(featureData => {
      this.setState({
        progressBarType: featureData.data.theme,
      });
    });
  }

  get progressBarTypes() {
    return [
      ProgressBars.Zombie,
      ProgressBars.NyanCat,
      ProgressBars.Football,
      ProgressBars.Poop,
      ProgressBars.Purge,
      ProgressBars.WarCrab,
      ProgressBars.Orcs,
      ProgressBars.Unicorn,
      ProgressBars.Panda,
      ProgressBars.Horse,
      ProgressBars.Fire,
      ProgressBars.Moon,
    ];
  }

  private progressBarChange(progressBarType: ProgressBars) {
    featureStorageService.storeFeatureData(MetaCustomProgressBar.id, { theme: progressBarType }).then(featureData => {
      this.setState({ progressBarType });

      if (featureData.status) {
        this.notifyTabsAboutChange();
      }
    });
  }

  private notifyTabsAboutChange() {
    const message: IMessageRestart = {
      restart: {
        featureId: MetaCustomProgressBar.id,
      }
    };

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message);
      });
    });
  }

  render() {
    const customBars = this.progressBarTypes.map(progressBarType => {
      const imageUrl = chrome.extension.getURL(`/images/bars/${progressBarType}.gif`);

      return (
        <Tooltip title={`Select "${progressBarType}" themed progress bar`} arrow={true} position='top'>
          <div className='progress-bar'>
            <div className={`progress-bar__preview myga--custom-bar bar--${progressBarType}`}>
              <div className='preview__full-progress'></div>
              <div className='ytp-play-progress'></div>
              <div className='preview__center'>
              <div className='ytp-scrubber-container' style={{backgroundImage: `url(${imageUrl})`}}></div>
              </div>
            </div>
            <div className='progress-bar__selector'>
              <label className='selector'>
                <input
                  type='radio'
                  value={progressBarType}
                  checked={this.state.progressBarType === progressBarType}
                  onChange={this.progressBarChange.bind(this, progressBarType)}
                />
                <span className='checkmark'></span>
              </label>
            </div>
          </div>
        </Tooltip>
      );
    });

    return (
      <div className='settings'>
        <BackToFeaturesComponent featureName={MetaCustomProgressBar.title} />
        <div className='settings__content'>
          {customBars}
        </div>
      </div>
    );
  }
}
