var express = require('express');
var auth = require('../../middlewares/auth');
var router = express.Router();

router.get('/profile-user',auth , (req, res) => {
    var isActive = "pu";
    return res.render('user/profile-user-normal', { 
        "isActive": isActive
    });
})

router.get('/security',auth , (req, res) => {
    var isActive = "s";
    return res.render('user/sercurity', { 
        "isActive": isActive
    });
});

//sử dụng POST cho logout vì sẽ thực sự logout, nếu dùng GET trình duyệt sẽ trước các trang mà nó nghĩ có thể vào
//Như thế không thực sự là logout https://stackoverflow.com/questions/3521290/logout-get-or-post
router.post('/logout',auth , (req, res, next) => {
    req.session.retUrl = null;
    req.logOut();
    res.redirect('/guest/login');
});
module.exports = router;