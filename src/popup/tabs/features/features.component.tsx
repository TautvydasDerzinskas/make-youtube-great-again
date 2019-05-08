

import * as React from 'react';
import SettingCompoent from './setting/setting.component';
import { FeaturesMeta } from '../../../features/features';
import browserService from '../../../services/common/browser.service';

export default class FeaturesComponent extends React.Component {
  render() {
    const allSettingsHtml = FeaturesMeta.map((featureMeta) => {
      if (!featureMeta.disabledBrowsers || !featureMeta.disabledBrowsers.includes(browserService.browserName)) {
        return <SettingCompoent key={featureMeta.id} meta={featureMeta}></SettingCompoent>;
      }
    });

    return (
      <div className='settings'>
        {allSettingsHtml}
      </div>
    );
  }
}
