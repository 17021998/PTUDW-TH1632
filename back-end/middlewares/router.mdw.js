module.exports = function (app){

    app.use('/', require('../routers/index/index.router'));
    app.use('/admin/categories', require('../routers/admin/category.router'));
    app.use('/admin', require('../routers/admin/admin.router'));
    app.use('/Chitietbaiviet', require('../routers/Chitietbaiviet/Chitietbaiviet.router'));
    app.use('/guest', require('../routers/guest/guest.router'));
    app.use('/editor', require('../routers/editor/editor.router'));

    app.use('/user', require('../routers/user/user.router'));
    app.use('/writer', require('../routers/writer/writer.router'));

}