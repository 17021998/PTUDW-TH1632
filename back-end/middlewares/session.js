var session = require('express-session');

module.exports = (app) => {
    app.use(session({
        secret: 'abcd',
        resave: true,
        saveUninitialized: true,
    }));
};