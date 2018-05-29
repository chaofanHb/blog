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
        //session������mongo��(60s)��ͨ��ʵ����       һ��connect-mongo�������ӡ�
        store: new MongoStore({
            url: settings.url   //�߰汾
            /*db: settings.db,
            host: settings.host,
            port: settings.port*/
        })
    }));
}