var express = require('express');
var path = require('path');
//路由
var index = require('./routes/index');
var users = require('./routes/users');
//打包
var compression = require('compression');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
//中间件
var simpleConfig = require('./middleware/simpleConfig');
var addFlash = require('./middleware/addFlash');
var mongoSession = require('./middleware/mongoSession');
var auth = require('./react_test/app/middleware/auth');
var errorHandle = require('./middleware/errorHandle');

var app = express();

//基础设置
simpleConfig(app);

//过滤静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  // 打包后静态文件目录
  app.get(/(\S+\.js|\S+\.css)/, express.static(path.join(__dirname, 'dist')));
}

//所有路由，添加session
mongoSession(app);
//flash
addFlash(app);

//小博客
//app.use('/', index);
//index(app);
app.use('/users', users);

//开发环境  热部署
if (process.env.NODE_ENV !== 'production') {
  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

//生产环境
if (process.env.NODE_ENV === 'production') {
  // 生产环境生成的静态页 过滤链到此处全部请求到index.html
  app.get('*', auth.useRequired, function allSendFile(req, res) {
    res.sendFile(__dirname + '/dist/index.html')
  });
}

//异常状态处理
errorHandle(app);
module.exports = app;
