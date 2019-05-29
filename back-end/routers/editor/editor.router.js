var express = require('express');
var router = express.Router();

router.get('/:iddm', (req, res) => {
    var danhmuc = req.param.iddm;
    var isActive = "xdbv";
    res.render('editor/editor-index', { "isActive": isActive });
})

// router.get('/dulich', (req, res) => {
//     var isActive = "dl";
//     res.render('editor/editor-index', { "isActive": isActive });
// })

// router.get('/doisong', (req, res) => {
//     var isActive = "ds";
//     res.render('editor/editor-index', { "isActive": isActive });
// })

// router.get('/thoisu', (req, res) => {
//     var isActive = "ts";
//     res.render('editor/editor-index', { "isActive": isActive });
// })

// router.get('/khoahoc', (req, res) => {
//     var isActive = "kh";
//     res.render('editor/editor-index', { "isActive": isActive });
// })

router.get('/profile-editor', (req, res) => {
    var isActive="pe";
    res.render('editor/profile-editor', { "isActive": isActive });
})

router.get('/security', (req, res) => {
    var isActive = "s";
    res.render('editor/security', { "isActive": isActive });
})


module.exports = router;