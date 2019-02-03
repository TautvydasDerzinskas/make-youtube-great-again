import * as React from 'react';
import { Tooltip } from 'react-tippy';
import { NavLink } from 'react-router-dom';

import IMeta from '../../../../interfaces/meta';
import { IMessageToggle } from '../../../../interfaces/communication';
import featureStorageService from '../../../../services/common/feature-storage.service';

import './setting.component.scss';

interface ISettingComponentState {
  data: {
    value: boolean;
    isNew: boolean;
  };
}

export default class SettingComponent extends React.Component<{ meta: IMeta<any> }, ISettingComponentState> {
  constructor(props: { meta: IMeta<any> }) {
    super(props);
    this.state = {
      data: {
        value: false,
        isNew: this.props.meta ? this.isNewFeature : false,
      },
    };
  }

  componentDidMount() {
    featureStorageService.getFeatureData(this.props.meta.id).then(featureData => {
      this.setState({
        data: {
          value: featureData.status,
          isNew: this.state.data.isNew,
        }
      });
    });
  }

  public toggleFeature() {
    featureStorageService.toggleFeatureStatus(this.props.meta.id).then(featureData => {
      this.setState({
        data: {
          value: featureData.status,
          isNew: this.state.data.isNew,
        }
      });
      this.notifyTabsAboutChange(featureData.status);
    });
  }

  get isNewFeature() {
    const featureDate = new Date(this.props.meta.releaseDate);
    const currentDate = new Date();

    const newFeatureEndTime = featureDate.getTime() + (7 * 24 * 60 * 60 * 1000);
    return newFeatureEndTime > currentDate.getTime();
  }

  get newFeatureImage() {
    let newFeatureImage;

    if (this.isNewFeature) {
      newFeatureImage = <span style={{ backgroundImage: 'url(./images/new.gif)', }}></span>;
    }

    return newFeatureImage;
  }

  private notifyTabsAboutChange(newValue: boolean) {
    const message: IMessageToggle = {
      toggle: {
        featureId: this.props.meta.id,
        value: newValue
      }
    };

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message);
      });
    });
  }

  get settingsColumn() {
    let settingsColumn;

    if (this.props.meta.hasSettings) {
      settingsColumn = (
        <div className='setting__column'>
          <Tooltip title='Click to configure' arrow={true} position='top'>
            <NavLink className='setting__settings-link' to={`/settings/${this.props.meta.id}`}>
              <svg><use xlinkHref='#myga-settings'></use></svg>
            </NavLink>
          </Tooltip>
        </div>
      );
    }

    return settingsColumn;
  }

  render() {
    return (
      <div className='setting'>
        <div className='setting__column'>
          <div className='setting__title'>{this.props.meta.title} {this.newFeatureImage}</div>
          <div>{this.props.meta.description}</div>
        </div>
        {this.settingsColumn}
        <div className='setting__column'>
          <Tooltip title={this.state.data.value ? 'Turn OFF' : 'Turn ON'} arrow={true} position='top'>
            <label className='setting__switch'>
              <input type='checkbox' checked={this.state.data.value} onChange={this.toggleFeature.bind(this)} />
              <span className='slider slider--round'></span>
            </label>
          </Tooltip>
        </div>
      </div>
    );
  }
}
