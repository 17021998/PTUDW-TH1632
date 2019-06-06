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
        return db.load('select post.*, category.CatName from post, catpost , category where post.ID=catpost.PostID and catpost.CatID=category.ID')
    },

    // Tag
    allTag:()=>{
        return db.load('select * from tag where IsDelete is null or IsDelete = 0');
    },

    addTag: entity=>{
        var sql=`insert into tag (TagName) values `;
        for(var i=0;i<entity.length-1;i++){
            sql+=`('${entity[i]}'), `
        }
        sql+=`('${entity[entity.length-1]}') ;`;
            return db.load(sql);
    },

    deleteTag: id=>{
        return db.delete('tag', 'ID', id);
    },

    getAllTagName:()=>{
        return db.load('select tag.TagName from tag where IsDelete is null or IsDelete = 0');
    }
    
};