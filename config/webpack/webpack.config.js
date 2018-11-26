const path = require('path')
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin");

const OUTPUT_FOLDER = path.resolve(__dirname, '../../extension');

module.exports = {
  entry: {
    background: path.resolve(__dirname, '../../src/background.ts'),
    content: path.resolve(__dirname, '../../src/content.ts'),
    onlinevideoconverter: path.resolve(__dirname, '../../src/providers/onlinevideoconverter.ts'),
    flvto: path.resolve(__dirname, '../../src/providers/flvto.ts'),
    savemp3: path.resolve(__dirname, '../../src/providers/savemp3.ts'),
    popup: path.resolve(__dirname, '../../src/popup.ts'),
    configuration: path.resolve(__dirname, '../../src/configuration.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].bundle.js',
    path: OUTPUT_FOLDER,
  },
  plugins: [
    new CleanWebpackPlugin(
      [OUTPUT_FOLDER],
      { root: path.resolve(__dirname, '../../') },
    ),
    new CopyWebpackPlugin([
      {
      from: path.resolve(__dirname, '../../src/manifest.json'),
      transform: function (content, path) {
        // generates the manifest file using the package.json informations
        return Buffer.from(
          JSON.stringify({
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...JSON.parse(content.toString()),
          })
        );
      },
    }]),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../../src/popup.html'),
      transform: function (content, path) {
        return Buffer.from(
          content.toString()
            .replace(/{{title}}/g, process.env.npm_package_description)
            .replace(/{{version}}/g, process.env.npm_package_version)
        );
      }
    }]),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../../src/configuration.html'),
      transform: function (content, path) {
        return Buffer.from(
          content.toString()
            .replace(/{{title}}/g, process.env.npm_package_description)
            .replace(/{{version}}/g, process.env.npm_package_version)
        );
      }
    }]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../../src/icons') }]),
  ],
};
