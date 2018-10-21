const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../../extension.ts'),
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   enforce: 'pre',
      //   loader: 'tslint-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, '../../extension')
  }
};
