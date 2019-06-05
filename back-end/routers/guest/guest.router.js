var express = require('express');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var router = express.Router();
var guestModel = require('../../modles/guest/guest.model');

router.get('/chuyen-de', (req,res,next)=> {
    Promise.all([
        guestModel.allCat()
    ]).then(([cats]) => {
        res.render('guest/chuyen-de',{
            cats:cats
        });
    }).catch(err => {
        console.log(err);
    });
})

router.get('/hash-tag', (req,res,next)=>{ 
    Promise.all([
        guestModel.allCat()
    ]).then(([cats]) => {
        res.render('guest/hash-tag',{
            cats:cats
        });
    }).catch(err => {
        console.log(err);
    });
})

router.get('/login', (req,res,next)=>{
    res.render('guest/login');
})

router.get('/search-result', (req,res,next)=>{
    Promise.all([
        guestModel.allCat()
    ]).then(([cats]) => {
        res.render('guest/search-result',{
            cats:cats
        });
    }).catch(err => {
        console.log(err);
    });
})

router.get('/sign_up', (req,res,next)=>{
    res.render('guest/sign_up');
});

router.post('/sign_up',(req, res,next) =>{
    var saltRounds = 10;
    var email = req.body.email;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var id = uuidv4();
    
    var entity = {
        ID : id,
        Email : email,
        PassHash : hash
    };

    guestModel.add(entity).then(ID =>{
        console.log(ID);
        res.redirect('/guest/login');
    }).catch(next);
});

router.get('/is-available', (req, res, next) => {
    var email = req.query.email;
    email = email.replace("%40","@");
    guestModel.singleByUserEmail(email).then(rows =>{
        if(rows.length > 0){
            return res.json(false);
        }
        return res.json(true);
    }).catch(next);
})
module.exports = router;