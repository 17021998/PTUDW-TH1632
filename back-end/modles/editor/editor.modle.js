var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {

    allPostBycategory: CatID=>{
        return db.load(`select p.*, c.CatName from post as p, catpost as cp , category as c where p.ID = cp.PostID and cp.CatID = c.ID and cp.CatID = ${CatID} and PostStatus is null`);
    },

    allcategory: ()=>{
        return db.load('select c.ID, c.CatName from category as c where c.SuperCatID is null');
    },

    getContentPost: ID=>{
        return db.load(`select p.Content from post as p where p.ID = ${ID}`);
    },

    getIDcategoryByPostID: Postid=>{
        return db.load(`select cp.CatID from catpost as cp where cp.PostID = ${Postid}`);
    },

    xetDuyetPost: entity=>{
        return db.update('post','ID', entity);
    }
    
};