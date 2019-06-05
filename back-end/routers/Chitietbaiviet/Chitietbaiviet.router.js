var express = require('express');
var router = express.Router();

var chitietbaiveitModel = require('../../modles/chitietbaiviet/chitietbaiviet.modle');


router.get('/', (req, res) => {

  Promise.all([
    chitietbaiveitModel.allCat(),
    chitietbaiveitModel.all()
  ]).then(([cats, rows]) => {
    res.render('Chitietbaiviet/ctbv', {
      cats: cats,
      chitietbaiviet: rows[0]
    });
  }).catch(err => {
    console.log(err);
  });
})

module.exports = router;