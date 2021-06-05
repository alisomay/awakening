const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: 'production',
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '..', './.env.production'),
    }),
  ],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
    publicPath: '',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'public', '**', '*'),
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['index.html', '**/ignored-directory/**'],
          },
          to: path.resolve(__dirname, '..', 'dist'),
        },
      ],
    }),
  ],
};
