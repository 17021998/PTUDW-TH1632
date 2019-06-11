var db = require('../../utils/db')

var nametable = "catpost";

module.exports = {
    
    // catagory
    allCatagoty: () => {
        var supQuery = 'SELECT ID, CatName, SuperCatID From category where SuperCatID IS NOT NULL AND IsDelete IS NULL';
        return db.load("SELECT c1.ID, c1.CatName, c2.ID as subID, c2.CatName as subName " + 
                    "FROM category c1 LEFT join ("+ supQuery + ") c2 on c1.ID = c2.SuperCatID " + 
                    "WHERE c1.IsDelete IS NULL AND c1.SuperCatID IS NULL ORDER BY c1.ID ;");
    },

    getCatagory:()=>{
        return db.load('select c.ID, c.CatName from category as c where c.SuperCatID is null')
    },
    
    single: id => {
    return db.load('select * from '+nametable+' where ID = ${id}');
    },

    add: entity => {
    return db.add(nametable, entity);
    },
    // post
    allPost: ()=>{
        return db.load('select post.*, category.CatName from post, catpost , category where post.ID=catpost.PostID and catpost.CatID=category.ID and post.IsDelete is null')
    },

    getPostByPostId: ID=>{
        return db.load(`select p.*, c.ID as CatID from post as p, catpost as cp , category as c where p.ID = cp.PostID and cp.CatID = c.ID and p.ID = ${ID} and p.IsDelete is null`);
    },

    savePost: entity=>{
        return db.update('post', 'ID', entity);
    },

    deletePost: id=>{
        return db.delete('post','ID',id);
    },

    // Tag
    deleteTagPost: (idT,idP)=>{
        return db.load(`update tagpost set IsDelete = 1 where TagID = ${idT} and PostID = ${idP}`);
    },

    getAllTagByPostID:id=>{
        return db.load(`select t.* from tagpost as tp, tag as t where tp.PostID = ${id} and t.ID = tp.TagID and tp.IsDelete is null`)
    },

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
    },

    getTagIDByName:(entity)=>{
        var idT = entity.idT; //  mang ten tag

        var sqlTag = `select t.ID from tag as t where `;
        for (let index = 0; index < idT.length-1; index++) {
            sqlTag+=`t.TagName = '${idT[index]}' or `
        }
        sqlTag += `t.TagName = '${idT[idT.length-1]}';`
        return db.load(sqlTag);
    },
    // tagpost

    addTagPost: entity=>{
        var idP = entity.idP;
        var idT = entity.idT; //  mang ten tag

        var sql = `insert into tagpost (TagID, PostID) values `;
        for(var i=0;i<idT.length-1;i++){
            sql+=`('${idT[i].ID}', '${idP}'), `
        }
        sql+=`('${idT[idT.length-1].ID}', '${idP}')`;

        return db.load(sql);
    }

};