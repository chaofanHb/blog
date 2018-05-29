var flash = require('connect-flash');

module.exports = function(app) {
    app.use(flash());
    //设置flash
    app.use(function(req, res, next){
        //将每次请求的flash赋值到变量error,info
        res.locals.error = req.flash('error') || "";
        res.locals.info = req.flash('info') || "";
        next();
    });
}