var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thnews8@gmail.com',
        pass: 'Quang123456'
    }
});

module.exports = transporter;