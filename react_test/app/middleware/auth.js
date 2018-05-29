


exports = module.exports = {

    //¹ýÂË
    useRequired: function (req, res, next) {
        var targetUrl =req.originalUrl;
        if(targetUrl !=='/'){
            return res.redirect(targetUrl);
        }
        next();
    }
}