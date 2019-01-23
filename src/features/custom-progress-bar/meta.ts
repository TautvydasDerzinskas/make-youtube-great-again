import IMeta from '../../interfaces/meta';
import { ProgressBars } from '../../enums';

const meta: IMeta = {
  id: 'myga-custom-progress-bar',
  description: 'Transform player progress bar to a cooler looking one',
  title: 'Custom progress bar',
  defaultStatus: false,
  videoPageOnly: true,
  isInHistoryTab: false,
  hasSettings: true,
  defaultData: {
    theme: ProgressBars.Poop,
  },
};

export default meta;
