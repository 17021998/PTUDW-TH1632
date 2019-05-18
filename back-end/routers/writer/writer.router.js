var express = require('express');
var router = express.Router();


router.get('/baivietduocduyet', (req, res) => {
    var isActive="bvdd";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/baivietdaxuatban', (req, res) => {
    var isActive="bvdxb";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/baivietbituchoi', (req, res) => {
    var isActive="bvbtc";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/baivietchuaduyet', (req, res) => {

    var isActive="bvcd";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/profile-writer', (req, res) => {
    var isActive="pw";
    res.render('writer/profile-writer', { "isActive": isActive });
     
})

router.get('/sercurity', (req, res) => {
    var isActive="s";
    res.render('writer/sercurity',{"isActive":isActive}); 
})

router.get('/', (req, res) => {
    var isActive="tbv";
    res.render('writer/writer',{"isActive":isActive}); 
})


module.exports = router;