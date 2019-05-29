var db = require('../utils/db')

var nametable = "departments";

module.exports = {
    all: () => {
        return db.load("SELECT c1.ID, c1.CatName, c2.ID as subID, c2.CatName as subName FROM catagory c1 LEFT join catagory c2 on c1.ID = c2.SuperCatID WHERE c1.SuperCatID IS NULL ORDER BY c1.ID");
    },

    single: id => {
    return db.load('select * from catagory where ID = ${id}');
    },
//NHớ đổi tên table là categories lại :)
    add: entity => {
    return db.add('catagory', entity);
    },

    update: entity => {
    return db.update('catagory', 'ID', entity);
    },

    delete: id => {
    return db.delete('catagory', 'ID', id);
    }
};