var express = require('express');
var router = express.Router();
var editorModle = require('../../modles/editor/editor.modle');



router.get('/profile-editor', (req, res) => {
    var isActive="pe";
    editorModle.allCatagory().then(rows=>{
        res.render('editor/profile-editor', { "isActive": isActive , categories: rows});
    }).catch();


})

router.get('/security', (req, res) => {
    var isActive = "s";
    editorModle.allCatagory().then(rows=>{
        res.render('editor/security', { "isActive": isActive , categories: rows});
    }).catch();
})

// xu li nay sau cung` vi no co cung root nếu muốn đổi root thì bỏ đâu cũng đc
router.get("/:iddm", (req, res) => {
    var iddanhmuc = req.params.iddm;
    Promise.all([
        editorModle.allCatagory(),
        editorModle.allPostByCatagory(iddanhmuc),
    ]).then(([rows, rowPostByCat])=>{
        for (let index = 0; index < rows.length; index++) {
           if(rows[index].ID===+iddanhmuc){
               var chuyenmuc = rows[index].CatName;
               rows[index].isActive = true;
           }
        }
        var isActive = "xdbv";
        console.log(rowPostByCat);
        res.render('editor/editor-index', { "isActive": isActive , "chuyenmuc": chuyenmuc , categories: rows , post: rowPostByCat});
    }).catch();
})

module.exports = router;