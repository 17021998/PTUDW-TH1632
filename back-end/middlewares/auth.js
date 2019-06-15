module.exports = (req, res, next) => {
    var path = req.originalUrl.split(/[//]/);
    if (!req.user) {
        req.session.retUrl = req.originalUrl;
        switch (path[1]) {
            case 'admin':
                res.redirect('/admin/login');
                break;
            case 'editor':
                res.redirect('/editor/login');
                break;
            case 'writer':
                res.redirect('/writer/login');
                break;
            default:
                res.redirect('/guest/login');
        }
    } else {
        var role = req.user.role;
        if ((role === path[1]) || (role == 'user' && path[1] == 'guest')) {
            // dùng return trước next() sẽ không phải tạo lỗi set header @@ render tạo lỗi ERR_HTTP_HEADERS_SENT
            return next();
        }
        res.render('404');
    }
}