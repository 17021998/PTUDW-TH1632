var express = require('express');
var router = express.Router();
var categoryModle = require('../../modles/categoty.modle');

router.get('/ctBaiViet', (req, res) => {
    //res.end('category admin');
    var p = categoryModle.all();
    p
        .then(rows => {
            //console.log(rows);
            res.render('admin/ctBaiViet');
        })
        .catch(err => {
            console.log(err);
        });
})

router.get('/editor-info',(req,res)=>{
    res.render('admin/editor-info');
})

router.get('/profile-admin',(req,res)=>{
    res.render('admin/profile-admin');
})

router.get('/qlBaiViet',(req,res)=>{
    res.render('admin/qlBaiViet');
})

router.get('/qlChuyenMuc',(req,res)=>{
    res.render('admin/qlChuyenMuc');
})

router.get('/qlHashTag',(req,res)=>{
    res.render('admin/qlHashTag');
})

router.get('/qlNguoiDung',(req,res)=>{
    res.render('admin/qlNguoiDung');
})

router.get('/security',(req,res)=>{
    res.render('admin/security');
})

router.get('/user-info',(req,res)=>{
    res.render('admin/user-info');
})
router.get('/writer-info',(req,res)=>{
    res.render('admin/writer-info');
})

module.exports = router;