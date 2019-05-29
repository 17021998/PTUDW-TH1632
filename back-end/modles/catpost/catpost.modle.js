var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {
    all: () => {
        return db.load('select * from ' + nametable);
    },
    
    
    single: id => {
    return db.load('select * from '+nametable+' where ID = ${id}');
    },

    add: entity => {
    return db.add(nametable, entity);
    },

    
};