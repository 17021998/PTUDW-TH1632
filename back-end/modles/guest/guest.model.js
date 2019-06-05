var db = require('../../utils/db');

module.exports = {
    singleByUserEmail: email => {
        return db.load(`select * from userprimary where Email = '${email}' and IsDelete IS NULL;`)
    },

    add: entity => {
        return db.add('userprimary',entity);
    },

    allCat: () => {
        var supQuery = 'SELECT ID, CatName, SuperCatID From category where SuperCatID IS NOT NULL AND IsDelete IS NULL';
        return db.load("SELECT c1.ID, c1.CatName, c2.ID as subID, c2.CatName as subName " + 
                    "FROM category c1 LEFT join ("+ supQuery + ") c2 on c1.ID = c2.SuperCatID " + 
                    "WHERE c1.IsDelete IS NULL AND c1.SuperCatID IS NULL ORDER BY c1.ID ;");
    }
}