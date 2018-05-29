var flash = require('connect-flash');

module.exports = function(app) {
    app.use(flash());
    //����flash
    app.use(function(req, res, next){
        //��ÿ�������flash��ֵ������error,info
        res.locals.error = req.flash('error') || "";
        res.locals.info = req.flash('info') || "";
        next();
    });
}