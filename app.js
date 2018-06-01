var express = require('express');
var path = require('path');
//路由
var index = require('./blog/routes/index');
var users = require('./blog/routes/users');
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
var apiProxy = require('./middleware/api_proxy');

var app = express();
var config = require('./react_redux_test/app/config/config');
var userInfo = require('./react_redux_test/app/middleware/user_info');
var proxy = require('express-http-proxy');

//基础设置
simpleConfig(app);

//过滤静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  // 打包后静态文件目录
  app.get(/(\S+\.js|\S+\.css)/, express.static(path.join(__dirname, 'react_redux_test/dist')));
}

//所有路由，添加session
mongoSession(app);
//flash
addFlash(app);

//小博客
//app.use('/', index);
//index(app);
app.use('/users', users);

//组织架构
// 获取当前用户信息
app.use('/api/info', userInfo);
// 将api请求转发至java,并将用户信息带到http headers中
app.use('/api', proxy(config.api_proxy_host_org, apiProxy('/uap/v1')));

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
    res.sendFile(__dirname + '/react_redux_test/dist/index.html')
  });
}

//异常状态处理
errorHandle(app);
module.exports = app;
