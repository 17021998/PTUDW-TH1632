var express = require('express');
var morgan = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs')
var path = require('path')
var crypto = require('crypto');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());


app.set('view engine', "ejs");
app.set("views", "./views/layouts");


var storage = multer.diskStorage({
    destination: 'public/upload/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)
            cb(null, Math.floor(Math.random() * 9000000000) + 1000000000 + path.extname(file.originalname))
        })
    }
})

var upload = multer({ storage: storage });
// lay anh xuong.
app.get('/files', function (req, res) {
    const images = fs.readdirSync('public/upload')
    var sorted = []
    for (let item of images) {
        if (item.split('.').pop() === 'png'
            || item.split('.').pop() === 'jpg'
            || item.split('.').pop() === 'jpeg'
            || item.split('.').pop() === 'svg') {
            var abc = {
                "image": "/upload/" + item,
                "folder": '/'
            }
            sorted.push(abc)
        }
    }
    res.send(sorted);
})
// upload anh len server
app.post('/upload', upload.array('flFileUpload', 12), function (req, res, next) {
    res.redirect('back')
});
// xoa file tren server
app.post('/delete_file', function (req, res, next) {
    var url_del = 'public' + req.body.url_del
    console.log(url_del)
    if (fs.existsSync(url_del)) {
        fs.unlinkSync(url_del)
    }
    res.redirect('back')
});



app.get('/', (req, res) => {
    res.render('index');
})

app.use('/admin/categories', require('./routers/admin/category.router'));
app.use('/admin', require('./routers/admin/admin.router'));
app.use('/Chitietbaiviet', require('./routers/Chitietbaiviet/Chitietbaiviet.router'));
app.use('/guest', require('./routers/guest/guest.router'));
app.use('/editor', require('./routers/editor/editor.router'));

app.use('/user', require('./routers/user/user.router'));
app.use('/writer', require('./routers/writer/writer.router'));
app.listen(3000, () => {
    console.log('http://localhost:3000');
})