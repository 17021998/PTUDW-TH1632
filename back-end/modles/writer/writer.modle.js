var db = require('../../utils/db')

var nametable = "post";

module.exports = {
    all: () => {
        return db.load('select * from ' + nametable);
    },
    
    getcategoryFather:()=>{
        return db.load('select c.ID, c.CatName from category as c where c.SuperCatID is null and IsDelete is null');
    },

    getCatagoryChild:()=>{
        return db.load('select * from category as c where c.SuperCatID is not null and IsDelete is null');
    },
    
    single: id => {
    return db.load('select * from '+nametable+' where ID = ${id}');
    },

    addPost: entity => {
    return db.add(nametable, entity);
    },

    addCatPost: entity => {
        return db.add('catpost', entity);
    },

    updatePost: entity => {
    return db.update('category', 'CatID', entity);
    },

    deletePost: id => {
    return db.delete('category', 'CatID', id);
    }
};