var express = require('express');
var router = express.Router();

var writerModle = require('../../modles/writer/writer.modle');

router.get('/', (req, res) => { 
    writerModle.getcategory()
    .then(rows => {
        var isActive = "tbv";
        res.render('writer/writer', { "isActive": isActive , categories: rows });
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
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

    req.body.Premium=0;
    req.body.ReleaseDay=null;
    req.body.PostStatus=null;
    var CatID = req.body.CatID;
    delete req.body['CatID'];
    console.log(req.body);
    writerModle.addPost(req.body).then(id => {
        // console.log(req.body);
        console.log(id);
        var catPost={
            'CatID': CatID,
            'PostID': id
        };
            // luu catpost
            writerModle.addCatPost(catPost)
            .then(id => {
                
            }).catch(err=>{
                console.log(err);
                res.end('error occured');
            });
        res.redirect('/writer');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
    // res.end('...');
})


module.exports = router;