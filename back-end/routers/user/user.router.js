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
router.post('/security',auth, (req, res) => {
    var pw = req.body.newpassword;
    console.log(pw);
    var hash = bcrypt.hashSync(pw, 10);
    guestModel.updatePassword(req.user.ID, hash)
    .then(()=>{
        res.redirect('/user/profile-user');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//sử dụng POST cho logout vì sẽ thực sự logout, nếu dùng GET trình duyệt sẽ trước các trang mà nó nghĩ có thể vào
//Như thế không thực sự là logout https://stackoverflow.com/questions/3521290/logout-get-or-post
router.post('/logout',auth , (req, res, next) => {
    req.session.retUrl = null;
    req.logOut();
    res.redirect('/guest/login');
});
module.exports = router;