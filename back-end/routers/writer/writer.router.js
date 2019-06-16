var express = require('express');
var router = express.Router();
var passport = require('passport');
var writerModle = require('../../modles/writer/writer.modle');
var auth = require('../../middlewares/auth');

router.get('/',auth, (req, res, next) => { 
    Promise.all([
        writerModle.getcategoryFather(),
        writerModle.getCatagoryChild()
    ])
    .then(([rowsF, rowsC])=>{
        var isActive = "tbv";
        res.render('writer/writer', { "isActive": isActive , "categories": rowsF , "CatChild": rowsC });
    }).catch(next);
    
})

router.get('/baivietduocduyet',auth, (req, res) => {
    var isActive="bvdd";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/baivietdaxuatban',auth, (req, res) => {
    var isActive="bvdxb";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/baivietbituchoi',auth, (req, res) => {
    var isActive="bvbtc";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/baivietchuaduyet',auth, (req, res) => {

    var isActive="bvcd";
    res.render('writer/baivietduocduyet', { "isActive": isActive }); 
})

router.get('/profile-writer',auth, (req, res) => {
    var isActive="pw";
    res.render('writer/profile-writer', { "isActive": isActive });
})

router.get('/security',auth, (req, res) => {
    var isActive="s";
    res.render('writer/security',{"isActive":isActive}); 
})

router.post('/add',auth, (req,res, next)=>{
    req.body.Premium=0;
    req.body.ReleaseDay=null;
    req.body.PostStatus=null;
    var CatID = req.body.CatID;
    delete req.body['CatID'];
    writerModle.addPost(req.body).then(id => {
        var catPost={
            'CatID': CatID,
            'PostID': id
        };
        var writerPost = {'WriterID': req.user.ID, 'PostID': id};
        Promise.all([
            writerModle.addCatPost(catPost),
            writerModle.addWriterPost(writerPost),
        ]).then(([id1,id2])=>{}).catch(next);
        res.redirect('/writer');
    }).catch(next);
    // res.end('...');
});

router.get('/login', (req, res) => {
    res.render('guest/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('guest/login', {
                layout: false,
                error: info.message
            });
        }
        var retUrl = req.session.retUrl || '/writer/profile-writer';
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            if (user.role == 'writer') {
                return res.redirect(retUrl);
            }
            //nếu là không phải writer thì ra 404
            return res.render('404');
        });
    })(req, res, next);
});

router.post('/logout',auth , (req, res, next) => {
    req.logOut();
    res.redirect('/writer/login');
});


module.exports = router;