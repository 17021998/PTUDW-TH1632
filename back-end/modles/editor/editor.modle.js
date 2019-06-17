var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {

    allPostBycategory: (CatID, userID)=>{
        return db.load(`select p.* 
        from post as p, category as c, catpost as cp, editorcat as ec 
        where ec.UserID='${userID}' and ec.ManagedCatID=cp.CatID and cp.PostID=p.ID and c.ID=ec.ManagedCatID AND c.SuperCatID = ${CatID}`);
    },

    allcategory: (id)=>{
        var sql = `select cat.ID, cat.CatName from category as cat,
        (select c.SuperCatID from editorcat as ec, category as c where ec.UserID = '${id}' and ec.ManagedCatID = c.ID group by c.SuperCatID) as cate 
        where cat.ID= cate.SuperCatID`
        return db.load(sql);
    },

    getContentPost: ID=>{
        return db.load(`select p.Content from post as p where p.ID = ${ID}`);
    },

    getIDcategoryByPostID: Postid=>{
        return db.load(`select c.SuperCatID from catpost as cp, category as c where cp.PostID = ${Postid} and c.ID = cp.CatID`);
    },

    xetDuyetPost: entity=>{
        return db.update('post','ID', entity);
    },

    allEditor: ()=>{
        return db.load(`select * from editorcat e, userprimary u where e.UserID = u.ID and u.IsDelete is Null;`);
    },
    
    addNewEditor: entity =>{
        return db.add("editorcat", entity);
    },

    single: id => {
        return db.load(`select * from editorcat e, userprimary u where e.UserID = ${id} and e.UserID = u.ID and u.IsDelete is Null;`);
    },

    pageByEditor: (limit, offset) => {
        return db.load(`select e.UserID, e.noc ,u.FullName, u.Email, u.DoB, u.Photo from userprimary u, (select distinct(UserID), count(ManagedCatID) as noc from editorcat group by UserID )as e where e.UserID = u.ID AND u.IsDelete is Null limit ${limit} offset ${offset};`);
    },

    countByEditor: () => {
        return db.load(`SELECT COUNT(*) AS total FROM (select * from userprimary u inner join (select distinct(UserID), count(ManagedCatID) as noc from editorcat group by UserID )as e on e.UserID = u.ID AND u.IsDelete is Null) as abc;`);
    },

    delete: id => {
        return db.delete('userprimary', 'ID', id);
    },

    update: entity => {
        return db.update('subscriber', 'UserID', entity);
    },
    someEditor: (limit)=>{
        return db.load(`select e.UserID, e.noc ,u.FullName, u.Email, u.DoB, u.Photo from userprimary u, (select distinct(UserID), count(ManagedCatID) as noc from editorcat group by UserID )as e where e.UserID = u.ID AND u.IsDelete is Null limit ${limit};`)
    },
    updateEditorProfile: (entity)=>{
        return  db.update('userprimary', 'ID', entity);
    }
};