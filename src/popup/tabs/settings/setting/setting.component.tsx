import * as React from 'react';

import IMeta from '../../../../interfaces/meta';
import featureStorageService from '../../../../services/common/feature-storage.service';

import './setting.component.scss';

interface ISettingComponentState {
  data: {
    value: boolean;
  };
}

export default class SettingComponent extends React.Component<{ meta: IMeta }, ISettingComponentState> {
  constructor(props: { meta: IMeta }) {
    super(props);
    this.state = {
      data: {
        value: false,
      },
    };
  }

  componentDidMount() {
    featureStorageService.getFeature(this.props.meta.id).then(value => {
      this.setState({
        data: {
          value: value,
        }
      });
    });
  }

  public toggleFeature() {
    featureStorageService.toggleFeature(this.props.meta.id).then(newValue => {
      this.setState({
        data: {
          value: newValue,
        }
      });
      this.notifyTabsAboutChange(newValue);
    });
  }

  private notifyTabsAboutChange(newValue: boolean) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(
          tab.id,
          {
            toggle: {
              featureId: this.props.meta.id,
              value: newValue
            }
          }
        );
      });
    });
  }

  render() {
    return (
      <div className='setting'>
        <div className='setting__column'>
          <div className='setting__title'>{this.props.meta.title}</div>
          <div>{this.props.meta.description}</div>
        </div>
        <div className='setting__column'>
          <label className='setting__switch'>
            <input type='checkbox' checked={this.state.data.value} onChange={this.toggleFeature.bind(this)} />
            <span className='slider slider--round'></span>
          </label>
        </div>
      </div>
    );
  }
}
