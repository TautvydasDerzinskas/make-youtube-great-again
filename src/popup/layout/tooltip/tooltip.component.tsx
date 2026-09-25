import * as React from 'react';

import './tooltip.component.scss';

interface ITooltipComponentProps {
  title: string;
  position?: 'top' | 'bottom' | 'right';
  children?: React.ReactNode;
}

/**
 * Lightweight CSS only tooltip
 */
export default class TooltipComponent extends React.Component<ITooltipComponentProps> {
  render() {
    const position = this.props.position || 'top';

    return (
      <div className={`tooltip tooltip--${position}`} data-tooltip={this.props.title}>
        {this.props.children}
      </div>
    );
  }
}
