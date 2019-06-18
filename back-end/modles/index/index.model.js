var db = require('../../utils/db');

module.exports = {
    allCat: () => {
        var supQuery = 'SELECT ID, CatName, SuperCatID From category where SuperCatID IS NOT NULL AND IsDelete IS NULL';
        return db.load("SELECT c1.ID, c1.CatName, c2.ID as subID, c2.CatName as subName " + 
                    "FROM category c1 LEFT join ("+ supQuery + ") c2 on c1.ID = c2.SuperCatID " + 
                    "WHERE c1.IsDelete IS NULL AND c1.SuperCatID IS NULL ORDER BY c1.ID ;");
    },

    searchTag: entity =>{
        return db.load(`select t.TagName from ${entity.table} as t where MATCH(TagName) AGAINST ('${entity.value}')`);
    },
    topThreeWeek: () => {
        return db.load(`SELECT * FROM post 
                        WHERE IsDelete IS NULL 
                        AND PostStatus = 1 
                        ORDER BY Viewed AND ABS( DATEDIFF( ReleaseDay, NOW() ) ) DESC
                        LIMIT 3`);
    },
    topMostTen: () => {
        return db.load(`SELECT * FROM post 
                        WHERE IsDelete IS NULL 
                        AND PostStatus = 1 
                        ORDER BY Viewed DESC
                        LIMIT 10`);
    },
    topNewTen: () => {
        return db.load(`SELECT * 
                        FROM post 
                        WHERE IsDelete IS NULL
                        AND PostStatus = 1
                        ORDER BY ABS( DATEDIFF( ReleaseDay, NOW() ) ) DESC
                        LIMIT 10 ;`);
    },
    topTenCate: () => {

    },
    allByCat: (CatID) => {
        return db.load(`SELECT p.ID, p.Title, p.Abstract, p.Content, p.ReleaseDay, p.ImageAbstract, p.Premium, t.TagName ,                t.ID as TagID
                        FROM post p
                        left join tagpost tp on p.ID = tp.PostID
                            left	join tag t on tp.TagID = t.ID
                            join catpost c on c.PostID = p.ID
                        WHERE p.IsDelete Is NULL
                        AND c.CatID = ${CatID}
                        AND p.ReleaseDay <= CURRENT_DATE
                        ORDER BY p.Premium DESC ,p.ID DESC`)
    },
    getCatById: id => {
        return db.load(`SELECT c1.ID, c1.CatName, c2.ID as FID, c2.CatName as FName 
                        FROM category c1 left join category c2 on c1.SuperCatID = c2.ID 
                        WHERE c1.IsDelete IS NULL AND c1.ID = ${id} ;`);
    },
    allByTag: (tagId) => {
        return db.load(`SELECT p.ID, p.Title, p.Abstract, p.Content, p.ReleaseDay, p.ImageAbstract, p.Premium, t.TagName ,                t.ID as TagID
                        FROM post p
                        left join tagpost tp on p.ID = tp.PostID
                        left	join tag t on tp.TagID = t.ID
					    join tagpost c on c.PostID = p.ID
                        WHERE p.IsDelete Is NULL
						AND c.TagID = ${tagId}
                        AND p.ReleaseDay <= CURRENT_DATE
                        ORDER BY p.Premium DESC ,p.ID DESC`);
    },
    getTagByID: id => {
        return db.load(`SELECT * from tag where ID = ${id} AND IsDelete Is NULL;`)
    }
};