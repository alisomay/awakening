const path = require('path');
const Dotenv = require('dotenv-webpack');
module.exports = {
  mode: 'development',
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '..', './.env.development'),
    }),
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(path.join(__dirname, '..', 'public')),
    hot: true,
    host: '0.0.0.0',
  },
};
