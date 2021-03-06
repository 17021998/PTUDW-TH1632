﻿var express = require('express');
var router = express.Router();
var editorModle = require('../../modles/editor/editor.modle');
var passport = require('passport');
var auth = require('../../middlewares/auth');
var isLogin = require('../../middlewares/checkLogInOut');
var bcrypt = require('bcrypt');
var guestModel = require('../../modles/guest/guest.model');

// lay du lieu bai viet de dua ra cho editor xem va duyet
router.post('/getContentPost', (req, res,next) => {
    editorModle.getContentPost(req.body.id)
        .then(rows => {
            var content = rows[0].Content;
            res.end(content);
        }).catch(next);

});
// xet duyet bbai viet
router.post('/xetduyet', (req, res, next) => {
    req.body.PostStatus = 1;
    req.body.editorID = req.user.ID;
    var id = req.body.ID; // id post
	if(req.body.ReleaseDay || 1){
        req.body.ReleaseDay = new Date();
    }

    var tag = req.body.tagname;
    var Arr = split(",", tag); // danh sach cac tag.
    var arr = {"idP" : id, "idT": Arr};
    delete req.body['tagname'];

    Promise.all([
        editorModle.xetDuyetPost(req.body),
        editorModle.getIDcategoryByPostID(id),
        editorModle.getTagIDByName(arr)
    ]).then(([idP, CatID, rowsTag]) => {

        var idT =[];
            for (let index = 0; index < rowsTag.length; index++) {
                idT[index] = rowsTag[index];
            }
            var arr1 = {"idP" : id, "idT": idT};
            editorModle.addTagPost(arr1)
            .then().catch();

        res.redirect('/editor/' + CatID[0].SuperCatID);
    }).catch(next);

});
// tu choi bai viet
router.post('/tuchoi', (req, res,next) => {
    req.body.PostStatus = -1;
    req.body.editorID = req.user.ID;
    var id = req.body.ID;
req.body.ReleaseDay = null;
    Promise.all([
        editorModle.xetDuyetPost(req.body),
        editorModle.getIDcategoryByPostID(id)
    ]).then(([id, CatID]) => {
        res.redirect('/editor/' + CatID[0].SuperCatID);
    }).catch(next);
});

router.get('/profile-editor', (req, res,next) => {
    var isActive = "pe";
    editorModle.allcategory(req.user.ID).then(rows => {
        res.render('editor/profile-editor', { "isActive": isActive, categories: rows });
    }).catch(next);
});
// router post update profile editor.
router.post('/update/profile-editor', (req, res) => {
    var entity = req.body;
    var name = req.body.FullName||1;
    var mail = req.body.Email || 1;
    if( name!=1 ){ 
        req.user.FullName = name;
    }
    if( mail!=1 ){ 
        req.user.Email = mail;
    }
    editorModle.updateEditorProfile(entity)
    .then(id=>{
        res.end('success');
    }).catch();
    
});

//Thay doi mat khau cua editor
router.get('/security', (req, res,next) => {
    var isActive = "s";
    editorModle.allcategory(req.user.ID).then(rows => {
        res.render('editor/security', { "isActive": isActive, categories: rows });
    }).catch(next);
});

router.post('/security',auth, (req, res) => {
    var pw = req.body.newpassword;
    console.log(pw);
    var hash = bcrypt.hashSync(pw, 10);
    guestModel.updatePassword(req.user.ID, hash)
    .then(()=>{
        res.redirect('/editor/profile-editor');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//Đăng nhập cho editor
router.get('/login',isLogin, (req, res) => {
    res.render('guest/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) {
            return res.render('guest/login',{
                layout: false,
                error: info.message
            }); 
        }
        var retUrl = req.session.retUrl || '/editor/profile-editor';
        req.logIn(user, err => {
            if (err) { 
                return next(err); 
            }
            if(user.role == 'editor'){
                return res.redirect(retUrl);
            }
            //nếu không phải editor thì chạy ra trang 404
            return res.render('404');
        });
    })(req, res, next);
});

router.post('/logout',auth , (req, res, next) => {
    req.session.retUrl = null;
    req.logOut();
    res.redirect('/editor/login');
});


router.get('/editorDaDuyet',(req,res,next)=>{
    Promise.all([
        editorModle.allcategory(req.user.ID),
        editorModle.allPostXetDuyet(req.user.ID),
    ])
    .then(([rows, rowPost])=>{
        var isActive = "bvdd";
        res.render('editor/editorDaDuyet', { "isActive": isActive, categories: rows, post: rowPost });
    })
    .catch(next);
});

router.get('/editorTuChoi',(req,res,next)=>{
    Promise.all([
        editorModle.allcategory(req.user.ID),
        editorModle.allPostTuChoi(req.user.ID),
    ])
    .then(([rows, rowPost])=>{
        var isActive = "bvtc";
        res.render('editor/EditorTuChoi', { "isActive": isActive, categories: rows, post: rowPost });
    })
    .catch(next);
});

// xu li nay sau cung` vi no co cung root nếu muốn đổi root thì bỏ đâu cũng đc
router.get("/:iddm", (req, res,next) => {
    var iddanhmuc = req.params.iddm;
    Promise.all([
        editorModle.allcategory(req.user.ID),
        editorModle.allPostBycategory(iddanhmuc, req.user.ID),
    ]).then(([rows, rowPostByCat]) => {
        for (let index = 0; index < rows.length; index++) {
            if (rows[index].ID === +iddanhmuc) {
                var chuyenmuc = rows[index].CatName;
                rows[index].isActive = true;
            }
        }
        var isActive = "xdbv";
        res.render('editor/editor-index', { "isActive": isActive, "chuyenmuc": chuyenmuc, categories: rows, post: rowPostByCat });

    }).catch(next);
});
module.exports = router;