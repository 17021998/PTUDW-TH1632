var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {

    allPostByCatagory: CatID=>{
        return db.load(`select p.*, c.CatName from post as p, catpost as cp , catagory as c where p.ID = cp.PostID and cp.CatID = c.ID and cp.CatID = ${CatID}`);
    },

    allCatagory: ()=>{
        return db.load('select c.ID, c.CatName from catagory as c where c.SuperCatID is null');
    }
    
};