var express = require('express');
var path = require('path');
//·��
var index = require('./routes/index');
var users = require('./routes/users');
//���
var compression = require('compression');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
//�м��
var simpleConfig = require('./middleware/simpleConfig');
var addFlash = require('./middleware/addFlash');
var mongoSession = require('./middleware/mongoSession');
var auth = require('./react_test/app/middleware/auth');
var errorHandle = require('./middleware/errorHandle');

var app = express();

//��������
simpleConfig(app);

//���˾�̬�ļ�
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  // �����̬�ļ�Ŀ¼
  app.get(/(\S+\.js|\S+\.css)/, express.static(path.join(__dirname, 'dist')));
}

//����·�ɣ����session
mongoSession(app);
//flash
addFlash(app);

//С����
//app.use('/', index);
//index(app);
app.use('/users', users);

//��������  �Ȳ���
if (process.env.NODE_ENV !== 'production') {
  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

//��������
if (process.env.NODE_ENV === 'production') {
  // �����������ɵľ�̬ҳ ���������˴�ȫ������index.html
  app.get('*', auth.useRequired, function allSendFile(req, res) {
    res.sendFile(__dirname + '/dist/index.html')
  });
}

//�쳣״̬����
errorHandle(app);
module.exports = app;
