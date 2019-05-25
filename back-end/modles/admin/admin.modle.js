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

    allPost: ()=>{
        return db.load('select post.*, catagory.CatName from post, catpost , catagory where post.ID=catpost.PostID and catpost.CatID=catagory.ID')
    }
    
};