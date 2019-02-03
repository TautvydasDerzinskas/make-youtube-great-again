import * as React from 'react';
import { Tooltip } from 'react-tippy';

import featureStorageService from '../../../../../services/common/feature-storage.service';

import { IMessageRestart } from '../../../../../interfaces/communication';

import './data-setting.component.scss';

interface IDataSettingComponentProps {
  featureId: string;
  dataKey: string;
  label: string;
}

interface IDataSettingComponentState {
  featureStatus: boolean;
  dataValue: boolean;
}

export default class DataSettingComponent extends React.Component<IDataSettingComponentProps, IDataSettingComponentState> {
  constructor(props: IDataSettingComponentProps, state: IDataSettingComponentState) {
    super(props, state);
    this.state = {
      featureStatus: true,
      dataValue: true,
    };
  }

  componentDidMount() {
    featureStorageService.getFeatureData<any>(this.props.featureId).then(featureData => {
      this.setState({
        featureStatus: featureData.status,
        dataValue: featureData.data[this.props.dataKey],
      });
    });
  }

  public toggle() {
    const updatedData: any = {};
    updatedData[this.props.dataKey] = !this.state.dataValue;
    featureStorageService.extendFeatureData(this.props.featureId, updatedData).then(featureData => {
      const dataValue = featureData.data[this.props.dataKey];
      this.setState({ dataValue });

      if (this.state.featureStatus) {
        this.notifyTabsAboutChange();
      }
    });
  }

  private notifyTabsAboutChange() {
    const message: IMessageRestart = {
      restart: {
        featureId: this.props.featureId,
      }
    };

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message);
      });
    });
  }

  render() {
    const inputId = `input-id-${this.props.dataKey}`;
    return (
      <div className='dt-checkbox'>
        <Tooltip title={this.state.dataValue ? 'Turn OFF' : 'Turn ON'} arrow={true} position='right'>
          <input
            className='dt-checkbox__input'
            id={inputId} type='checkbox'
            checked={this.state.dataValue}
            onChange={this.toggle.bind(this)}
          />
          <label className='dt-checkbox__label' htmlFor={inputId}>
            <span>
              <svg width='12px' height='10px' viewBox='0 0 12 10'>
                <polyline points='1.5 6 4.5 9 10.5 1' />
              </svg>
            </span>
            <span>{this.props.label}</span>
          </label>
        </Tooltip>
      </div>
    );
  }
}
