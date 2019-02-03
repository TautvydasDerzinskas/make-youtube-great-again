

import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Layout components
import IconsComponent from './layout/icons/icons.component';
import HeaderComponent from './layout/header/header.component';

// Tab components
import HistoryComponent from './tabs/history/history.component';
import FeaturesComponent from './tabs/features/features.component';
import LinksComponent from './tabs/links/links.component';

// Settings
import MetaCustomProgressBar from '../features/custom-progress-bar/meta';
import CustomProgressBarSettingsComponent from '../features/custom-progress-bar/settings/custom-progress-bar-settings.component';
import MetaHideComments from '../features/hide-comments/meta';
import HideCommentsSettingsComponent from '../features/hide-comments/settings/hide-comments-settings.component';


import './app.component.scss';

export default class AppComponent extends React.Component<{}> {
  render() {
    return (
      <div className='myga'>
        <IconsComponent />
        <HeaderComponent />
        <div className='tabs-content'>
          <Switch>
            <Route exact path='/' render={() => (
              <Redirect to='/settings' />
            )}/>
            <Route exact path='/settings' component={FeaturesComponent}/>
            <Route exact path='/history' component={HistoryComponent}/>
            <Route exact path='/links' component={LinksComponent}/>

            <Route exact path={`/settings/${MetaCustomProgressBar.id}`} component={CustomProgressBarSettingsComponent}/>
            <Route exact path={`/settings/${MetaHideComments.id}`} component={HideCommentsSettingsComponent}/>
          </Switch>
        </div>
      </div>
    );
  }
}
