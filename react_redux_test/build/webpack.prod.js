/**
 * webpack production config
 * @authors hebin
 * @date    2016-07-15 11:03:43
 */

var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.base.js');
var CleanWebpackPlugin = require('clean-webpack-plugin');

webpackConfig.output.publicPath = './';

webpackConfig.plugins.push(
  new CleanWebpackPlugin(['dist'], {
    root: path.resolve(__dirname, '../'),
  })
)
webpackConfig.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress : {
      warnings: false,
      // unused: true,
      // dead_code: true,
    },
    output: {
      comments: false,
    },
  })
);
webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  })
);
webpackConfig.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin()
);

module.exports = webpackConfig;
