var express = require('express');
var router = express.Router();

var writerModel = require('../../modles/writer/writer.modle');

router.get('/', (req, res) => {
    var isActive="tbv";
    res.render('writer/writer',{"isActive":isActive}); 
})

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

router.get('/security', (req, res) => {
    var isActive="s";
    res.render('writer/security',{"isActive":isActive}); 
})



router.post('/add', (req,res)=>{

    req.body.Premium=null;
    req.body.ReleaseDay=null;
    req.body.PostStatus=null;

    console.log(req.body);
    writerModel.add(req.body).then(id => {
        // console.log(req.body);
        res.redirect('/writer');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
})


module.exports = router;