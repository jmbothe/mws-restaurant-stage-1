const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'build');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: {
    main: `${APP_DIR}/js/main.js`,
    restaurant_info: `${APP_DIR}/js/restaurant_info.js`,
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].js',
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    hot: true,
    stats: 'errors-only',
    open: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      API_HOST: 'localhost',
      API_PORT: '1337',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      excludeChunks: ['sw', 'restaurant_info'],
      // minify: {
      //   collapseWhiteSpace: true,
      // },
    }),
    new HtmlWebpackPlugin({
      template: './src/restaurant.html',
      filename: 'restaurant.html',
      excludeChunks: ['sw', 'main'],
      // minify: {
      //   collapseWhiteSpace: true,
      // },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin([
      { from: `${APP_DIR}/img`, to: `${BUILD_DIR}/img` },
      { from: `${APP_DIR}/icons`, to: `${BUILD_DIR}/icons` },
      { from: `${APP_DIR}/manifest.json`, to: `${BUILD_DIR}/manifest.json` },
    ]),
    new OfflinePlugin({
      ServiceWorker: {
        entry: `${APP_DIR}/sw.js`,
        minify: true,
        updateStrategy: 'changed',
        caches: {
          main: [
            '/',
            '/restaurant.html',
            '/main.css',
            '/restaurant_info.css',
            '/main.js',
            '/restaurant_info.js',
          ],
          optional: [':rest:'],
        },
        AppCache: false,
      },
    }),
  ],
};
