var db = require('../utils/db')

var nametable = "departments";

module.exports = {
    all: () => {
        return db.load('select * from ' + nametable);
    },
    
    
    single: id => {
    return db.load('select * from '+nametable+' where CatID = ${id}');
    },

    add: entity => {
    return db.add('categories', entity);
    },

    update: entity => {
    return db.update('categories', 'CatID', entity);
    },

    delete: id => {
    return db.delete('categories', 'CatID', id);
    }
};