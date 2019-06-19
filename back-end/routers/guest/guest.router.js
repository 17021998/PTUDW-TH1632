var express = require('express');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var passport = require('passport');
var router = express.Router();
var guestModel = require('../../modles/guest/guest.model');
var subscriberModel = require('../../modles/subcriber/subcriber.modle');
var request = require('request');
var mailTransporter = require('../../utils/email');
var mailContent = require('../../utils/resetMail');
var isLogin = require('../../middlewares/checkLogInOut');
var moment = require('moment');

router.get('/chuyen-de', (req,res,next)=> {
    Promise.all([
        guestModel.allCat()
    ]).then(([cats]) => {
        res.render('guest/chuyen-de',{
            cats:cats
        });
    }).catch(next);
})

router.get('/hash-tag', (req,res,next)=>{ 
    Promise.all([
        guestModel.allCat()
    ]).then(([cats]) => {
        res.render('guest/hash-tag',{
            cats:cats
        });
    }).catch(next);
})

router.get('/login',isLogin, (req,res,next)=>{
    res.render('guest/login', {isNormalUser: true});
})

router.get('/search-result', (req,res,next)=>{
    Promise.all([
        guestModel.allCat()
    ]).then(([cats]) => {
        res.render('guest/search-result',{
            cats:cats
        });
    }).catch(next);
})

router.get('/sign_up', isLogin, (req, res, next) => {
    res.render('guest/sign_up', {isNormalUser: true});
});

router.post('/sign_up', (req, res, next) => {
    var response = req.body['g-recaptcha-response'];
    if(response === undefined ||
        response === '' ||
        response === null){
            return res.render('guest/sign_up',{error: "Hãy Hoàn thành CAPTCHA"});
        }
    var screctKey = "6LdA8agUAAAAAGFAwN4_nIbLlermd1t4nqVedlpQ";
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret="+
            screctKey+"&response="+response+"&remoteip="+req.connection.remoteAddress;
    
    request(verificationUrl, (err, res, body) => {
        if(body.success !== undefined && !body.success){
            return res.render('guest/sign_up', {error: "Không thể xác thực CAPTCHA"});
        }
    });

    var saltRounds = 10;
    var email = req.body.email;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var id = uuidv4();
    var today = new Date().toLocaleDateString();
    var beginDay = moment(today, 'MM/DD/YYYY').format('YYYY-MM-DD');
    var currentDay = new Date();
    var endDay = new Date(currentDay.getTime() + 86400000*7); // + 7 day in ms
    var entity = {
        ID: id,
        Email: email,
        PassHash: hash,
        role: 'user'
    };
    var entity2 = {
        UserID: id,
        Status: 1,
        BeginDay: beginDay,
        EndDay : endDay
    };
    guestModel.add(entity)
    .then(()=>{
        subscriberModel.add(entity2)
        .then(()=>{
            return res.redirect('/guest/login')
        }).catch(next);
    }).catch(next);
});

router.get('/is-available', (req, res, next) => {
    var email = req.query.email;
    email = email.replace("%40", "@");
    guestModel.singleByUserEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    }).catch(next);
});
//
router.get('/password-available', (req, res, next)=>{
    var pw = req.query.oldpassword;
    var id = req.user.ID;
    guestModel.singleByUserId(id).then(rows => {
        if (rows.length > 0) {
            var ret = bcrypt.compareSync(pw, rows[0].PassHash);
            if(ret){
                return res.json(true);
            }else{
                return res.json(false);
            }
        }
        console.log("false 2");
        return res.json(false);
    }).catch(next);
})

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
        var retUrl = req.session.retUrl || '/';
        req.logIn(user, err => {
            if (err) { 
                return next(err); 
            }
            return res.redirect(retUrl);
        });
    })(req, res, next);
});

router.get('/auth/google', passport.authenticate('google',{
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', 
    passport.authenticate('google',{
        failureRedirect: '/guest/login'
    }), (req, res, next) => {
        res.redirect('/');
    });

router.get('/reset', (req, res, next) => {
    res.render('guest/verifyEmail');
});

router.get('/is-correct-code', (req, res, next) => {
    var code = req.query.code;
    var correctCode = req.session.code;
    if(code == correctCode){
        return res.json(true);
    }else{
        return res.json(false);
    }
});

router.post('/resetEmail', (req, res, next) => {
    var userMail = req.body.email;
    console.log(userMail);
    guestModel.singleByUserEmail(userMail)
    .then((rows) => {
        if(rows.length === 0){
            return res.render("guest/verifyEmail", {error: "Email không tồn tại"});
        }else{
            req.session.resetID = rows[0].ID;
            var token = Math.floor(Math.random() * (+9999999 - +1000000)) + +1000000;
            var content = mailContent(token);
            var mailOptions = {
                from: 'no-reply@yth16news.com',
                sender: 'no-reply@yth16news.com',
                replyTo : 'no-reply@yth16news.com',
                to: userMail,
                subject:'Password Reset Verification Token',
                html: content
            };
            mailTransporter.sendMail(mailOptions, (err) => {
                if(err){
                    next(err);
                }
                console.log("Gui mail thanh cong");
                req.session.code = token;
                mailTransporter.close();
                res.render('guest/reset-password');
            })
        }
    }).catch(next);
});

router.post('/reset-password', (req, res, next) => {
    var password = req.body.password;
    var hash = bcrypt.hashSync(password, 10);
    var entity = {
        ID: req.session.resetID,
        PassHash: hash
    };
    guestModel.update(entity)
    .then(()=>{
        res.redirect('/guest/login');
    }).catch(next);
});
module.exports = router;