import * as React from 'react';

import BackToFeaturesComponent from '../../../popup/tabs/features/settings/back-to-features/back-to-features.component';
import DataSettingComponent from '../../../popup/tabs/features/settings/data-setting/data-setting.component';

import MetaHideComments from '../meta';

import './hide-comments-settings.component.scss';

export default class HideCommentsSettingsComponent extends React.Component {
  render() {
    return (
      <div className='hc-settings'>
        <BackToFeaturesComponent featureName={MetaHideComments.title} />
        <div className='hc-settings__content'>
          <div className='hc-settings__setting'>
            <DataSettingComponent
              label='Hide regular comments under videos'
              featureId={MetaHideComments.id}
              dataKey='comments'
            />
          </div>
          <div className='hc-settings__setting'>
            <DataSettingComponent
              label='Hide live stream chat messages'
              featureId={MetaHideComments.id}
              dataKey='chat'
            />
          </div>
        </div>
      </div>
    );
  }
}
