declare module '*.scss';
declare module '*.css';

declare module '*.svg' {
  const content: string;
  export default content;
}

/**
 * Build time constants, injected by rspack DefinePlugin
 */
declare const __BROWSER__: 'chrome' | 'firefox';
declare const __MYGA__: {
  title: string;
  homepage: string;
  author: string;
  authorPage: string;
  version: string;
  bugs: string;
};
