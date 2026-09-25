import * as React from 'react';
import SettingCompoent from './setting/setting.component';
import { FeaturesMeta } from '../../../features/features-meta';
import browserService from '../../../services/common/browser.service';

import './features.component.scss';

export default class FeaturesComponent extends React.Component {
  render() {
    const allSettingsHtml = FeaturesMeta.map((featureMeta) => {
      // Always on features have nothing to toggle
      if (!featureMeta.alwaysOn && (!featureMeta.disabledBrowsers || !featureMeta.disabledBrowsers.includes(browserService.browserName))) {
        return <SettingCompoent key={featureMeta.id} meta={featureMeta}></SettingCompoent>;
      }
    });

    return (
      <div className='features-list'>
        {allSettingsHtml}
      </div>
    );
  }
}
