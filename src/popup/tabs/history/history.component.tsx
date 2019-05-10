

import * as React from 'react';
import FeatureStatsGroupComponent from './feature-stats-group/feature-stats-group.component';
import browserService from '../../../services/common/browser.service';

import { FeaturesMeta } from '../../../features/features';

export default class HistoryComponent extends React.Component {

  render() {
    const allGroupsHtml = FeaturesMeta.map((featureMeta) => {
      if (featureMeta.isInHistoryTab && (!featureMeta.disabledBrowsers || !featureMeta.disabledBrowsers.includes(browserService.browserName))) {
        return <FeatureStatsGroupComponent key={featureMeta.id} meta={featureMeta} />;
      }
    });

    return (
      <div className='history'>
        {allGroupsHtml}
      </div>
    );
  }
}
