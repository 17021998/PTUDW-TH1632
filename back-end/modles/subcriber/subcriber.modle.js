var db = require('../../utils/db')

module.exports = {
    add: entity =>{
        return db.add("subscriber", entity);
    },
    allSubcriber: () => {
        return db.load(`select * from subscriber s, userprimary u where s.UserID = u.ID and u.IsDelete is Null;`);
    },
    pageBySubcriber: (limit, offset) => {
        return db.load(`select * from subscriber s, userprimary u where s.UserID = u.ID and u.IsDelete is Null limit ${limit} offset ${offset};`);
    },
    countBySubcriber: () => {
        return db.load(`select count (*) as total from subscriber s, userprimary u where s.UserID = u.ID and u.IsDelete is Null;`);
    }
};