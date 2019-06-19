var db = require('../../utils/db')

var nametable = "post";

module.exports = {
    all: () => {
        return db.load('select * from ' + nametable);
    },
    addViewed: (id) => {
        return db.load(`UPDATE post SET Viewed = Viewed + 1 WHERE ID = ${id};`)
    },
    
    single: id => {
        return db.load(`select p.*, w.WriterName from post as p, writerpost as wp, writer as w where p.ID = ${id} and wp.PostID = p.ID and wp.WriterID = w.UserID`);
    },

    getComment: (id)=>{
        return db.load(`SELECT * FROM comment as c LEFT JOIN userprimary as up on c.UserID = up.ID where c.PostID = ${id} and c.IsDelete is null`);
    },
    getPostSame: id=>{
        return db.load(`select * from post as p, (select cp.CatID as cID from catpost as cp where cp.PostID = ${id}) as a, catpost as ct where a.cID =ct.CatID and p.ID = ct.PostID LIMIT 4`);
    },
    getTenTag: id => {
        return db.load(`select * from tagpost tp join tag t on t.ID = tp.TagID WHERE t.IsDelete IS NULL AND tp.PostID = ${id};`);
    },
    getCat: id => {
        return db.load(`SELECT c.ID, c.CatName, c1.ID as FID, c1.CatName as FName 
                        FROM catpost ct 
                        join category c on ct.CatID = c.ID 
                        left join category c1 on c.SuperCatID = c1.ID
                        WHERE ct.PostID = ${id} `);
    },

    addComment: entity =>{
        return db.add('comment', entity);
    },

    update: entity => {
    return db.update('catagory', 'CatID', entity);
    },

    delete: id => {
    return db.delete('catagory', 'CatID', id);
    },
    
    allCat: () => {
        var supQuery = 'SELECT ID, CatName, SuperCatID From category where SuperCatID IS NOT NULL AND IsDelete IS NULL';
        return db.load("SELECT c1.ID, c1.CatName, c2.ID as subID, c2.CatName as subName " + 
                    "FROM category c1 LEFT join ("+ supQuery + ") c2 on c1.ID = c2.SuperCatID " + 
                    "WHERE c1.IsDelete IS NULL AND c1.SuperCatID IS NULL ORDER BY c1.ID ;");
    }
};