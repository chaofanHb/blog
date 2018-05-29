var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var favicon = require('serve-favicon');

module.exports = function(app) {
    //图标
    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    app.use(logger('dev'));
    //请求参数
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    //静态目录托管 localhost:3000/favicon.ico
    app.use(express.static(path.join(__dirname, '../public')));

    //小博客视图层
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
}