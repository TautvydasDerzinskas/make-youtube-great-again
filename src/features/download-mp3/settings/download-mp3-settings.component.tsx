import * as React from 'react';

import BackToFeaturesComponent from '../../../popup/tabs/features/settings/back-to-features/back-to-features.component';
import DataSettingComponent from '../../../popup/tabs/features/settings/data-setting/data-setting.component';

import MetaSaveMp3 from '../meta';
import Providers from '../providers/providers';

import './download-mp3-settings.component.scss';

export default class DownloadMp3SettingsComponent extends React.Component {
  render() {
    const settingsHtml = Providers.map(provider => {
      return (
        <div className='dm-settings__setting'>
          <DataSettingComponent
            label={provider.name}
            featureId={MetaSaveMp3.id}
            dataKey={provider.id}
          />
        </div>
      );
    });

    return (
      <div className='dm-settings'>
        <BackToFeaturesComponent featureName={MetaSaveMp3.title} />
        <div className='dm-settings__content'>
          {settingsHtml}
        </div>
      </div>
    );
  }
}
