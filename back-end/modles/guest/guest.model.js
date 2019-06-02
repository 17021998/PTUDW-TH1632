var db = require('../../utils/db');

module.exports = {
    singleByUserEmail: email => {
        return db.load(`select * from userprimary where Email = '${email}' and IsDelete IS NULL;`)
    },

    add: entity => {
        return db.add('userprimary',entity);
    }
}