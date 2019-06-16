var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
var guestModel = require('../modles/guest/guest.model');
var key = require('../utils/googleKey');

module.exports = (app) => {
    var gs = new GoogleStrategy({
        clientID: key.ClientID,
        clientSecret: key.ClientSecret,
        callbackURL: "/guest/auth/google/callback"
    },
    (req, token, tokenSecret, profile, done) => {
        if(!req.user){
            var entity = {
                ID: profile.id,
                ProviderCo: profile.provider,
                FullName: profile.displayName,
                Photo: profile.photos[0].value,
                role: 'user'
            };
            guestModel.singleByUserId(profile.id)
            .then((rows)=>{
                if(rows.length === 0){
                    guestModel.add(entity)
                    .then(() => {
                        return done(null,entity);
                    }).catch(err => {
                        console.log(err);
                    });
                }
                var user = rows[0];
                return done(null,user);
            }).catch( err => {
                console.log(err);
                return done(err, false)
            });
        }
    });

    passport.serializeUser((user,done) => {
        return done(null, user);
    });

    passport.deserializeUser((user, done) => {
        return done(null, user);
    });
    passport.use(gs);
};