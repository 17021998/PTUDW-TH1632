var express = require('express');

var app = express();

app.use(express.static('public'));

app.set('view engine', "ejs");
app.set("views","./views/layouts");

app.get('/', (req,res)=>{
    res.render('index');
})

app.use('/admin/categories', require('./routers/admin/category.router'));

app.use('/guest', require('./routers/guest/guest.router'));

app.listen(3000, ()=>{
    console.log('http://localhost:3000');
})