var express = require('express');
var morgan = require('morgan'); 
var app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());


app.set('view engine', "ejs");
app.set("views", "./views/layouts");
// Đăng nhập Đăng Kí
require('./middlewares/session')(app);
require('./middlewares/passport')(app);
require('./middlewares/passport-google')(app);
// tao var user trong session
require('./middlewares/user')(app);
// Tao admin
// require('./utils/admin')("admin@th16news.hcmus","1234567");
// middlewares upload hinh anh.
require('./middlewares/upload')(app);
// middlwwares chua cac router.
require('./middlewares/router.mdw')(app);

//Xử lý error 404
app.use((req, res, next)=>{
    res.render('404', {layout: false});
})

//Xử lý lỗi tổng quát
app.use((error,req, res, next)=>{
    res.render('errors', {
        layout: false, 
        message: error.message, 
        error
    })
})
app.listen(3000, () => {
    console.log('http://localhost:3000');
})