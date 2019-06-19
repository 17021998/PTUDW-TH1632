var db = require('../../utils/db')

module.exports = {
    add: entity =>{
        return db.add("subscriber", entity);
    },
    single: id => {
        return db.load(`select * from subscriber s, userprimary u where s.UserID = '${id}' and s.UserID = u.ID and u.IsDelete is Null;`);
    },
    allSubcriber: () => {
        return db.load(`select * from subscriber s, userprimary u where s.UserID = u.ID and u.IsDelete is Null;`);
    },
    pageBySubcriber: (limit, offset) => {
        return db.load(`select * from subscriber s, userprimary u where s.UserID = u.ID and u.IsDelete is Null limit ${limit} offset ${offset};`);
    },
    countBySubcriber: () => {
        return db.load(`select count (*) as total from subscriber s, userprimary u where s.UserID = u.ID and u.IsDelete is Null;`);
    },
    delete: id => {
        db.load(`delete from subscriber where UserID = '${id}';`);
        return db.delete('userprimary', 'ID', id);
    },
    update: entity => {
        return db.update('subscriber', 'UserID', entity);
    },
    someSubcriber: (limit)=>{
        return db.load(`select * from subscriber s, userprimary u where s.UserID = u.ID and u.IsDelete is Null limit ${limit};`)
    }
};