var express = require('express');
var router = express.Router();

router.get('/chuyen-de', (req,res)=> {
    res.render('guest/chuyen-de');
})

router.get('/hash-tag', (req,res)=>{
    res.render('guest/hash-tag');
})

router.get('/login', (req,res)=>{
    res.render('guest/login');
})

router.get('/search-result', (req,res)=>{
    res.render('guest/search-result');
})

router.get('/sign_up', (req,res)=>{
    res.render('guest/sign_up');
})

router.get('/:id/chuyen-de', (req, res, next)=>{
    throw new Error('bom')
})

module.exports = router;