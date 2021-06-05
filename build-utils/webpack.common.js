const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.js'),
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'audio-worklet': path.resolve(
        __dirname,
        '..',
        'src/experience/audio-worklet.js',
      ),
    },
  },
  module: {
    parser: {
      javascript: {
        worker: ['AudioWorklet from audio-worklet', '...'],
      },
    },
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: ['webpack-glsl-loader'],
      },
      { test: /\.(mp4)$/, loader: 'url-loader' },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
        exclude: [/img/],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Awakening',
      template: path.resolve(__dirname, '..', 'public/index.html'),
    }),
  ],
};
