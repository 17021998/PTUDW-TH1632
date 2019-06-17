module.exports = (req, res, next) => {
    if (!req.user) {
        return next();
    } else {
        res.render('404');
    }
}