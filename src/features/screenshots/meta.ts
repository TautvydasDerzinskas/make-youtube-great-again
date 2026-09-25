import IMeta from '../../interfaces/meta';
import screenshotsService from './services/screenshots.service';

const meta: IMeta<{}> = {
  id: 'myga-screenshots',
  description: 'Allows taking screenshots',
  title: 'Screenshots',
  defaultStatus: true,
  videoPageOnly: true,
  isInHistoryTab: false,
  releaseDate: '2026-09-26',
  dataView: {
    title: 'Your screenshots',
    hasData: () => screenshotsService.getAll().then(screenshots => screenshots.length > 0),
    onChange: listener => screenshotsService.onChange(listener),
  },
};

export default meta;
