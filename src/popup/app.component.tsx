import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router';

// Layout components
import IconsComponent from './layout/icons/icons.component';
import HeaderComponent from './layout/header/header.component';
import RouteErrorBoundary from './layout/error-boundary/error-boundary.component';

// Tab components
import HistoryComponent from './tabs/history/history.component';
import FeaturesComponent from './tabs/features/features.component';
import LinksComponent from './tabs/links/links.component';

// Settings
import MetaCustomProgressBar from '../features/custom-progress-bar/meta';
import CustomProgressBarSettingsComponent from '../features/custom-progress-bar/settings/custom-progress-bar-settings.component';
import MetaHideComments from '../features/hide-comments/meta';
import HideCommentsSettingsComponent from '../features/hide-comments/settings/hide-comments-settings.component';
import MetaCommentDrafts from '../features/comment-drafts/meta';
import CommentDraftsSettingsComponent from '../features/comment-drafts/settings/comment-drafts-settings.component';
import MetaScreenshots from '../features/screenshots/meta';
import ScreenshotsComponent from '../features/screenshots/popup/screenshots.component';

import './app.component.scss';

export default class AppComponent extends React.Component<{}> {
  render() {
    return (
      <div className='myga'>
        <IconsComponent />
        <HeaderComponent />
        <div className='tabs-content'>
          <RouteErrorBoundary>
            <Routes>
              <Route path='/' element={<Navigate to='/settings' replace />}/>
              <Route path='/settings' element={<FeaturesComponent />}/>
              <Route path='/history' element={<HistoryComponent />}/>
              <Route path='/links' element={<LinksComponent />}/>

              <Route path={`/settings/${MetaCustomProgressBar.id}`} element={<CustomProgressBarSettingsComponent />}/>
              <Route path={`/settings/${MetaHideComments.id}`} element={<HideCommentsSettingsComponent />}/>
              <Route path={`/settings/${MetaCommentDrafts.id}`} element={<CommentDraftsSettingsComponent />}/>
              <Route path={`/settings/${MetaScreenshots.id}`} element={<ScreenshotsComponent />}/>
            </Routes>
          </RouteErrorBoundary>
        </div>
      </div>
    );
  }
}
