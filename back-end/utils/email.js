var mail = require('nodemailer');
var ggKey = require('./googleKey.js');

var auth = {
    type: 'oauth2',
    user: 'aquarius.superstar@gmail.com',
    clientId : ggKey.EmailID,
    clientSecret: ggKey.EmailSecret,
    refreshToken: ggKey.RefreshToken
};

module.exports = mail.createTransport({
    service: 'gmail',
    auth: auth,
});