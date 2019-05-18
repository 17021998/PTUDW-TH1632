var express = require('express');
var router = express.Router();
var categoryModle = require('../../modles/categoty.modle');

router.get('/ctBaiViet', (req, res) => {
    var isActive = "ctbv";
    res.render('admin/ctBaiViet', { "isActive": isActive });

})

router.get('/editor-info', (req, res) => {
    var isActive = "ei";
    res.render('admin/editor-info', { "isActive": isActive });
})

router.get('/profile-admin', (req, res) => {
    var isActive = "pa";
    res.render('admin/profile-admin', { "isActive": isActive });
})

router.get('/qlBaiViet', (req, res) => {
    var isActive = "qlbv";
    res.render('admin/qlBaiViet', { "isActive": isActive });
})

router.get('/qlChuyenMuc', (req, res) => {
    var isActive = "qlcm";
    res.render('admin/qlChuyenMuc', { "isActive": isActive });
})

router.get('/qlHashTag', (req, res) => {
    var isActive = "qlht";
    res.render('admin/qlHashTag', { "isActive": isActive });
})

router.get('/qlNguoiDung', (req, res) => {
    var isActive = "qlnd";
    res.render('admin/qlNguoiDung', { "isActive": isActive });
})

router.get('/security', (req, res) => {
    var isActive = "s";
    res.render('admin/security', { "isActive": isActive });
})

router.get('/user-info', (req, res) => {
    var isActive = "ui";
    res.render('admin/user-info', { "isActive": isActive });
})
router.get('/writer-info', (req, res) => {
    var isActive = "wi";
    res.render('admin/writer-info', { "isActive": isActive });
})

module.exports = router;