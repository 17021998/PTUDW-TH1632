var express = require('express');
var router = express.Router();

var chitietbaiveitModel = require('../../modles/chitietbaiviet/chitietbaiviet.modle');


router.get('/', (req,res)=> {
    chitietbaiveitModel.all()
    .then(rows => {
        console.log(rows);
        // res.end('...');
            res.render('Chitietbaiviet/ctbv', {chitietbaiviet: rows[2] });
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
})

module.exports = router;