var db = require('./db');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
module.exports = (email, password) => {
    var saltRounds = 10;
    var hash = bcrypt.hashSync(password, saltRounds);
    var id = uuidv4();
    var admin = {
        ID: id,
        Email: email,
        PassHash: hash,
        role: 'admin'
    };

    db.add("userprimary", admin)
    .then(() => {
        console.log("Create Admin successs");
    }).catch(err => {
        console.log(err);
    });
}