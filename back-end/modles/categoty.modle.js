var db = require('../utils/db')

var nametable = "catagory";

module.exports = {
    all: () => {
        return db.load('select * from ' + nametable);
    },
    
    
    single: id => {
    return db.load('select * from '+nametable+' where CatID = ${id}');
    },

    add: entity => {
    return db.add(nametable, entity);
    },

    update: entity => {
    return db.update('catagory', 'CatID', entity);
    },

    delete: id => {
    return db.delete('catagory', 'CatID', id);
    }
};