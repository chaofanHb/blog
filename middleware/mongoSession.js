var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('../settings');

module.exports = function(app) {
    app.use(session({
        resave:true,
        saveUninitialized: true,
        secret: settings.cookieSecret,
        key: settings.db,//cookie name
        cookie: {maxAge: 1000 * 60 },//30 days * 60 * 24 * 30
        //session储存在mongo中(60s)，通过实例化       一个connect-mongo进行连接。
        store: new MongoStore({
            url: settings.url   //高版本
            /*db: settings.db,
            host: settings.host,
            port: settings.port*/
        })
    }));
}