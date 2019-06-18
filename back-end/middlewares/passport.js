var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var guestModel = require('../modles/guest/guest.model');
var userModel = require('../modles/subcriber/subcriber.modle');
var bcrypt = require('bcrypt');
module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    var ls = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    },(username, password, done) => {
        guestModel.singleByUserEmail(username).then(rows => {
            if(rows.length === 0){
                return done(null, false, {message: 'Invalid email.'});
            }
            var user = rows[0];
            var ret = bcrypt.compareSync(password, rows[0].PassHash);
            if(ret){
                // gắn passport cho user
                return done(null, user);
            }
            return done(null, false, {message: 'Invalid password'});
        }).catch(err => {
            return done(err, false);
        });
    });

    passport.use(ls);

    passport.serializeUser((user,done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
};