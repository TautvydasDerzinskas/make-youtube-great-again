import IMeta from '../../interfaces/meta';
import { ICustomProgressBarData } from './interfaces/costom-progress-bar.interface';

import { ProgressBars } from '../../enums';

const meta: IMeta<ICustomProgressBarData> = {
  id: 'myga-custom-progress-bar',
  description: 'Transform player progress bar to a cooler looking one',
  title: 'Custom progress bar',
  defaultStatus: false,
  videoPageOnly: true,
  isInHistoryTab: false,
  hasSettings: true,
  defaultData: {
    theme: ProgressBars.Unicorn,
  },
};

export default meta;
