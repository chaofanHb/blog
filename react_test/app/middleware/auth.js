


exports = module.exports = {

    //����
    useRequired: function (req, res, next) {
        var targetUrl =req.originalUrl;
        if(targetUrl !=='/'){
            return res.redirect(targetUrl);
        }
        next();
    }
}