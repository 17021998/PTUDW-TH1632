var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {

    allPostBycategory: CatID=>{
        return db.load(`select p.*, cs.CatName from (select * from category as c where c.SuperCatID=${CatID}) as cs, catpost as cp, post as p where cs.ID = cp.CatID and p.ID=cp.PostID and p.PostStatus is null and p.IsDelete is null`);
    },

    allcategory: ()=>{
        return db.load('select c.ID, c.CatName from category as c where c.SuperCatID is null');
    },

    getContentPost: ID=>{
        return db.load(`select p.Content from post as p where p.ID = ${ID}`);
    },

    getIDcategoryByPostID: Postid=>{
        return db.load(`select c.SuperCatID from catpost as cp, category as c where cp.PostID = ${Postid} and c.ID = cp.CatID`);
    },

    xetDuyetPost: entity=>{
        return db.update('post','ID', entity);
    }
    
};