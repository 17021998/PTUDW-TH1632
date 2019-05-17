var express = require('express');

var app = express();

app.use(express.static('public'));

app.set('view engine', "ejs");
app.set("views","./views/layouts");

app.get('/', (req,res)=>{
    res.render('index');
})

app.use('/admin/categories', require('./routers/admin/category.router'));
app.use('/admin', require('./routers/admin/admin.router'));
app.use('/Chitietbaiviet', require('./routers/Chitietbaiviet/Chitietbaiviet.router'));
app.use('/guest', require('./routers/guest/guest.router'));
app.use('/editor', require('./routers/editor/editor.router'));
app.listen(3000, ()=>{
    console.log('http://localhost:3000');
})