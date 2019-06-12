var db = require('../../utils/db')

var nametable = "subscriber";

module.exports = {
    add: entity =>{
        return db.add(nametable, entity);
    }
    
};