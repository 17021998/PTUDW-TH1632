var mysql = require('mysql');
//https://remotemysql.com/phpmyadmin/index.php?db=BE9zYddj2X
// link database user password thì có ở dưới.
var createConnection = () => {
  return mysql.createConnection({

    
    //remotemysql.com
    host: 'remotemysql.com',
    //BE9zYddj2X
    user: 'BE9zYddj2X',
    port: 3306,
    //2gwc9GcKjk
    password: '2gwc9GcKjk',
    //BE9zYddj2X
    database: 'BE9zYddj2X'
    // host: 'localhost',
    // user: 'root',
    // port: 3306,
    // password: 'root',
    // database: 'th16news',
    // dateStrings: true
  });
}

module.exports = {
  load: sql => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();
      connection.query(sql, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
        connection.end();
      })
    });
  },

  add: (tableName, entity) => {
    return new Promise((resolve, reject) => {
      var sql = `insert into ${tableName} set ? ;`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, entity, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value.insertId);
        }
        connection.end();
      });
    });
  },

  update: (tableName, idField, entity) => {
    return new Promise((resolve, reject) => {
      var id = entity[idField];
      delete entity[idField];
      var sql = `update ${tableName} set ? where ${idField} = ? ;`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, [entity, id], (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value.changedRows);
        }
        connection.end();
      });
    });
  },

  delete: (tableName, idField, id) => {
    return new Promise((resolve, reject) => {
      //var sql = `delete from ${tableName} where ${idField} = ? ;`;
      var sql = `update ${tableName} set IsDelete = 1 where ${idField} = ? ;`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, id, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value.affectedRows);
        }
        connection.end();
      });
    });
  },

  delete2Key: (tableName, idField1, idField2, id1, id2) => {
    return new Promise((resolve, reject) => {
      //var sql = `delete from ${tableName} where ${idField} = ? ;`;
      var sql = `update ${tableName} set IsDelete = 1 where ${idField1} = ? and ${idField2} = ?;`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, id1, id2, (error, value) => {
        console.log(value);
        if (error) {
          reject(error);
        } else {
          console.log(value);
          resolve(1);
        }
        connection.end();
      });
    });
  }

}