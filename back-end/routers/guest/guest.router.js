var express = require('express');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var passport = require('passport');
var router = express.Router();
var guestModel = require('../../modles/guest/guest.model');
var subscriberModel = require('../../modles/subcriber/subcriber.modle');
var handlePost =require('../../utils/processListPostData');
var request = require('request');
var mailTransporter = require('../../utils/email');
var mailContent = require('../../utils/resetMail');
var isLogin = require('../../middlewares/checkLogInOut');
var moment = require('moment');
var indexModel = require('../../modles/index/index.model');

router.get('/chuyen-de/:id', (req,res,next)=> {
    var page = req.query.page || 1;
    if(page < 1 || isNaN(page)){
        page=1;
    }
    var limit = 5;
    var offset = (page - 1) * limit;
    var catId = req.params.id;
    Promise.all([
        indexModel.allCat(),
        indexModel.allByCat(catId, limit, offset),
        indexModel.getCatById(catId),
        indexModel.getCountByCat(catId)
        // thieu get count();
    ]).then(([cats, posts, cat, count]) => {
        var counts = count[0].totals;
        var len = Math.floor(counts / limit);
        if(counts % limit>0){
            len++;
        }

        var lenPage=[];
        if(len < 5){
            lenPage.push({"begin": 0, "end": len-1});
        }else {
            if(page -2 <=1){
                lenPage.push({"begin": 0, "end": 4});
            } else if(page + 2>=len){
                lenPage.push({"begin": len-5, "end": len-1});
            }else {
                lenPage.push({"begin": page -2, "end": +page + 2});
            }
        }

        var pages = [];
        if(len!=0){
            for( i =0 ;i<len;i++){
                pages.push({"value": i, "isActive": i===+page-1});
            }
        }else{
            pages.push({"value": 0, "isActive": true});
        }

        var posts1 = handlePost(posts); //Chuyển danh sách bài viết thành có hashtag
        res.render('guest/chuyen-de.ejs',{
            cats:cats,
            posts: posts1,
            cat: cat[0],
            "page": pages,
            "p": page,
            "lenPage": lenPage[0]
        });
    }).catch(next);
})

router.get('/hash-tag/:id', (req,res,next)=>{ 
    var TagId = req.params.id;
    Promise.all([
        guestModel.allCat(),
        indexModel.allByTag(TagId),
        indexModel.getTagByID(TagId)
    ]).then(([cats,posts, tag]) => {
        var posts1 = handlePost(posts);
        res.render('guest/hash-tag',{
            cats:cats,
            posts: posts1,
            tag: tag[0]
        });
    }).catch(next);
})

router.get('/login',isLogin, (req,res,next)=>{
    res.render('guest/login', {isNormalUser: true});
})

router.post('/search-result', (req,res,next)=>{
    var txtSearch = req.body.txtSearch;
    Promise.all([
        guestModel.allCat(),
        guestModel.searchPost(txtSearch)
    ]).then(([cats, rows]) => {
        res.render('guest/search-result',{
            cats:cats,
            rows,
            "value": txtSearch
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
            subscriberModel.single(user.ID)
            .then(rows => {
                var end = rows[0].EndDay;
                var status = 0;
                today = new Date().toLocaleDateString();
                var now = moment(today, 'MM/DD/YYYY').format('YYYY-MM-DD');
                var endday = new moment(end).format('YYYY-MM-DD');
                console.log(endday);
                console.log(now);

                if(end >= now){
                    status = 1;
                }
                console.log(status);
                user.EndDay = end;
                user.Status = status;
            }).catch(err => console.log(err));
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