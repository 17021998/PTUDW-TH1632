var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    var isActive = "xdbv ds";
    res.render('editor/editor-index', { "isActive": isActive });
})

router.get('/profile-editor', (req, res) => {
    var isActive="pe";
    res.render('editor/profile-editor', { "isActive": isActive });
})

router.get('/sercurity', (req, res) => {
    var isActive = "s";
    res.render('editor/sercurity', { "isActive": isActive });
})


module.exports = router;