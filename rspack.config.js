import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';

const SRC = resolve(import.meta.dirname, 'src');
const BROWSERS = ['chrome', 'firefox'];

/**
 * Firefox add-on ID on addons.mozilla.org, required for MV3 submissions
 * https://addons.mozilla.org/en-GB/firefox/addon/myga
 */
const FIREFOX_ADDON_ID = '{1b5b18c3-0744-4002-a6a0-b69ae69a5464}';

/**
 * Package metadata is read at build time (not from npm_package_* env vars)
 * so the version bumped by semantic-release is always the one shipped
 */
const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, 'package.json'), 'utf8'));

/**
 * Chrome requires a background service worker, Firefox only supports event pages
 */
const transformManifest = (content, browser) => {
  const manifest = JSON.parse(content.toString());
  manifest.version = pkg.version;
  manifest.description = pkg.description;
  manifest.homepage_url = pkg.homepage;

  if (browser === 'firefox') {
    manifest.background = { scripts: ['background.bundle.js'] };
    manifest.browser_specific_settings = {
      gecko: {
        id: FIREFOX_ADDON_ID,
        strict_min_version: '140.0',
        // Nothing is collected or sent to the extension author
        data_collection_permissions: { required: ['none'] },
      },
      gecko_android: {
        strict_min_version: '142.0',
      },
    };
  } else {
    manifest.background = { service_worker: 'background.bundle.js' };
    manifest.minimum_chrome_version = '120';
  }

  return JSON.stringify(manifest, null, 2);
};

export default defineConfig((env, argv) => {
  const browser = env.browser ?? 'chrome';
  if (!BROWSERS.includes(browser)) {
    throw new Error(`Unknown browser "${browser}", expected one of: ${BROWSERS.join(', ')}`);
  }
  const isProduction = argv.mode !== 'development';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'cheap-module-source-map',
    entry: {
      background: resolve(SRC, 'background.ts'),
      content: resolve(SRC, 'content.ts'),
      page: resolve(SRC, 'page.ts'),
      popup: resolve(SRC, 'popup.tsx'),
    },
    output: {
      filename: '[name].bundle.js',
      path: resolve(import.meta.dirname, 'dist', browser),
      asyncChunks: false,
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    // Extension scripts must be self-contained: content scripts and the
    // MV3 service worker can't load async chunks at runtime
    optimization: {
      splitChunks: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic', development: !isProduction } },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          type: 'javascript/auto',
        },
        {
          test: /\.svg$/,
          type: 'asset/source',
        },
      ],
    },
    plugins: [
      new rspack.DefinePlugin({
        __BROWSER__: JSON.stringify(browser),
        __MYGA__: JSON.stringify({
          title: pkg.name,
          homepage: pkg.homepage,
          author: pkg.author.name,
          authorPage: pkg.author.url,
          version: pkg.version,
          bugs: pkg.bugs.url,
        }),
      }),
      new rspack.CopyRspackPlugin({
        patterns: [
          {
            from: resolve(SRC, 'manifest.json'),
            transform: (content) => transformManifest(content, browser),
          },
          {
            from: resolve(SRC, 'popup.html'),
            transform: (content) => content.toString()
              .replace(/{{title}}/g, pkg.name)
              .replace(/{{version}}/g, pkg.version),
          },
          { from: resolve(SRC, 'assets') },
        ],
      }),
    ],
    performance: {
      hints: false,
    },
  };
});
