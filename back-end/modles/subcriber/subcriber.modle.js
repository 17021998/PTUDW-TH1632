var db = require('../../utils/db')

<<<<<<< HEAD
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
=======
var nametable = "subscriber";

module.exports = {
    add: entity =>{
        return db.add(nametable, entity);
    }
    
>>>>>>> 9387e4f758a54bc8e235f70f74dd1783bfa5feab
};