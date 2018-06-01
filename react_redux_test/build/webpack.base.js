var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var NodeModules = path.resolve(__dirname, '../../node_modules');
var AssetsPath = path.resolve(__dirname, '..','app','assets');

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, '../app/index.js'),
    ],
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[chunkhash:10].js',
    chunkFilename: '[name].[chunkhash:10].js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(
        'vendor', '[name].[hash:10].js'
    ),
    new ExtractTextPlugin('app.[contenthash:10].css'),
    new HtmlWebpackPlugin({
      template : path.resolve(__dirname, '../app/index.html'),
      filename : 'index.html',
      inject   : 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../app'),
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!less'),
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url?limit=8192',
      },
    ],
    // require
    unknownContextRegExp: /$^/,
    unknownContextCritical: false,

    // require(expr)
    exprContextRegExp: /$^/,
    exprContextCritical: false,

    // require("prefix" + expr + "surfix")
    wrappedContextRegExp: /$^/,
    wrappedContextCritical: false,
  },

  resolve: {
    extensions:['', '.js', '.json', '.css', 'less', 'png'],
    alias: {
      'normalize.css':  path.join(NodeModules, '/normalize.css'),
      'assets': AssetsPath,
    },
  },
}