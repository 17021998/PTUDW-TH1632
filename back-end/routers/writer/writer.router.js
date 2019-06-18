var express = require('express');
var router = express.Router();
var passport = require('passport');
var writerModle = require('../../modles/writer/writer.modle');
var auth = require('../../middlewares/auth');
var isLogin = require('../../middlewares/checkLogInOut');

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

router.get('/editWriterPost',auth,(req,res,next)=>{
    var id = req.query.idP;
    var isActive = req.query.isAc;
    Promise.all([
        writerModle.getcategoryFather(),
        writerModle.getCatagoryChild(),
        writerModle.getPostByPostId(id),
    ])
    .then(([rowsCat, rowC, rowsPos])=>{
        
        res.render('writer/editWriterPost',{"isActive": isActive, "Cat": rowsCat, "CatChild": rowC , "post": rowsPos[0]});
    }).catch(next);
})

router.post('/editorWriterPost', (req,res,next)=>{
    var entity = req.body;
    var isActive = req.query.isAc;
    req.body.PostStatus = null;
    req.body.ReleaseDay = null;
    req.body.Deny = null;
    req.body.editorID = null;
    var CatID = req.body.CatID;
    delete req.body['CatID'];
    var catpot={'CatID': CatID, 'PostID': req.body.ID};
    Promise.all([
        writerModle.updatePost(req.body),
        writerModle.updateCatPost(catpot),
    ])
    .then(([idP,idCP])=>{
        if(isActive == 'bvbtc'){
            res.redirect('/writer/baivietbituchoi');
        } else{
            res.redirect('/writer/baivietchuaduyet');
        }
    }).catch(next);
})

router.get('/baivietduocduyet',auth, (req, res, next) => {
    var isActive="bvdd";
    writerModle.getBVChuaXuatBan(req.user.ID)
    .then(rows=>{
        res.render('writer/baivietduocduyet', { "isActive": isActive , rows}); 
    })
    .catch(next)
    
})

router.get('/baivietdaxuatban',auth, (req, res,next) => {
    var isActive="bvdxb";
    writerModle.getBVDaXuatBan(req.user.ID)
    .then(rows=>{
        res.render('writer/baivietduocduyet', { "isActive": isActive , rows}); 
    })
    .catch(next)
})

router.get('/baivietbituchoi',auth, (req, res,next) => {
    var isActive="bvbtc";
    writerModle.getBVTuChoi(req.user.ID)
    .then(rows=>{
        res.render('writer/baivietduocduyet', { "isActive": isActive , rows}); 
    })
    .catch(next)
})

router.get('/baivietchuaduyet',auth, (req, res,next) => {

    var isActive="bvcd";
    writerModle.getBVDangDoi(req.user.ID)
    .then(rows=>{
        res.render('writer/baivietduocduyet', { "isActive": isActive , rows}); 
    })
    .catch(next) 
})


router.get('/profile-writer',auth, (req, res,next) => {
    var isActive="pw";
    var id = req.user.ID;
    writerModle.getWriter(id)
    .then(rows=>{
        res.render('writer/profile-writer', { "isActive": isActive , "WriterName": rows[0]});
    })
    .catch(next)
    
})
// router post update profile writer
router.post('/update/profile-writer', (req,res, next)=>{
    var entity = req.body;
    var name = req.body.FullName||1
    var mail = req.body.Email || 1;
    var butdanh = req.body.WriterName || 1;
    if( name!=1 ){ 
        req.user.FullName = name;
    }
    if( mail!=1 ){ 
        req.user.Email = mail;
    } 
    if( butdanh!=1 ){ 
        req.user.WriterName = butdanh;
    }
        writerModle.updateWriterProfile(entity)
        .then((id)=>{
            res.end('success');
        })
        .catch(()=>res.end('err'));
})
router.post('/updateW/profile-writer', (req,res, next)=>{
    var entity = req.body;
        writerModle.updateWriterN(entity)
        .then((id)=>{
            res.end('success');
        })
        .catch(()=>res.end('err'));
})

router.get('/security',auth, (req, res) => {
    var isActive="s";
    res.render('writer/security',{"isActive":isActive}); 
})

router.post('/add',auth, (req,res, next)=>{
    req.body.Premium=0;
    req.body.ReleaseDay=null;
    req.body.editorID = null;
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

router.get('/login',isLogin, (req, res) => {
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
    req.session.retUrl = null;
    req.logOut();
    res.redirect('/writer/login');
});


module.exports = router;