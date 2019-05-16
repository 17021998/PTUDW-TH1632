var express = require('express');
var router = express.Router();


router.get('/chuyen-de', (req,res)=> {
    res.render('guest/chuyen-de');
})

router.get('/hash-tag', (req,res)=>{
    res.render('guest/hash-tag');
})

module.exports = router;