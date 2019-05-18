var express = require('express');
var router = express.Router();


router.get('/profile-user', (req, res) => {
    var isActive = "pu";
    res.render('user/profile-user-normal', { "isActive": isActive });
})

router.get('/sercurity', (req, res) => {
    var isActive = "s";
    res.render('user/sercurity', { "isActive": isActive });
})

module.exports = router;