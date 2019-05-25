var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {

    allPostByCatagory: (CatID)=>{
        return db.load(`select post.*, catagory.CatName from post, catpost , catagory where post.ID=catpost.PostID and catpost.CatID=${CatID}`);
    },

    allCatagory: ()=>{
        
    }
    
};