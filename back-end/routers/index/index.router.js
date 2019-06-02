var express = require('express');
var router = express.Router();
var indexModel = require('../../modles/index/index.model');

router.get('/', (req, res) => {
    Promise.all([
        indexModel.allCat()
    ]).then(([cats]) => {
        res.render('index',{
            cats:cats
        });
    }).catch(err => {
        console.log(err);
    });
})

module.exports = router;
