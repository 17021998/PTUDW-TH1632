var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {

    allPostBycategory: CatID=>{
        //select * from (select c.ID from category as c where c.SuperCatID=4) as cs, catpost as cp, post as p where cs.ID = cp.CatID and p.ID=cp.PostID
        return db.load(`select p.*, cs.CatName from (select * from category as c where c.SuperCatID=${CatID}) as cs, catpost as cp, post as p where cs.ID = cp.CatID and p.ID=cp.PostID`);
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