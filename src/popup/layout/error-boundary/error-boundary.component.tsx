import * as React from 'react';
import { useLocation } from 'react-router';

import './error-boundary.component.scss';

interface IErrorBoundaryState {
  error: Error;
}

/**
 * Without it, an error in one tab unmounts the whole popup, leaving it blank
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, IErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('[MYGA] Popup error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className='error-boundary'>
          <strong>Something went wrong here.</strong>
          <div>{this.state.error.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Resets on navigation, so switching tabs recovers from an error
 */
export default function RouteErrorBoundary({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}
