const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: 'development',
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '..', './.env.development'),
    }),
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(path.join(__dirname, '..')),
    hot: true,
    host: '0.0.0.0',
  },
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
