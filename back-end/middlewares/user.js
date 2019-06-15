/*Cái này dùng để thêm user trong session vào biến của res.locals => có thể gọi user ở trang ejs cũng dc
*/ 

module.exports = (app) => {
    app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });
}