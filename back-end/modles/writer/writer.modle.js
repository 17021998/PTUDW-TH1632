var db = require('../../utils/db')

var nametable = "post";

module.exports = {
    all: () => {
        return db.load('select * from ' + nametable);
    },
    
    getCatagory:()=>{
        return db.load('select c.ID, c.CatName from catagory as c where c.SuperCatID is null')
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
    return db.update('catagory', 'CatID', entity);
    },

    deletePost: id => {
    return db.delete('catagory', 'CatID', id);
    }
};