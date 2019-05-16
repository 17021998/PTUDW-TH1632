var express = require('express');
var router = express.Router();
var categoryModle = require('../../modles/categoty.modle');

router.get('/', (req, res) => {
    //res.end('category admin');
    var p = categoryModle.all();
    p
        .then(rows => {
            //console.log(rows);
            res.render('admin/vwCategories/index', { department: rows });
        })
        .catch(err => {
            console.log(err);
        });
})

router.get('/add', (req, res) => {
    var p = categoryModle.all();
    p
        .then(rows => {
            //console.log(rows);
            res.render('admin/vwCategories/add', { department: rows });
        })
        .catch(err => {
            console.log(err);
        });
})

router.post('/add', (req, res) => {
    console.log(req.body);
})

module.exports = router;