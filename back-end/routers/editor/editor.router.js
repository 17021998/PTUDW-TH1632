var express = require('express');
var router = express.Router();
var editorModle = require('../../modles/editor/editor.modle');
// lay du lieu bai viet de dua ra cho editor xem va duyet
router.post('/getContentPost',(req,res)=>{
    editorModle.getContentPost(req.body.id)
    .then(rows=>{
        var content = rows[0].Content; 
        res.end(content);
    }).catch(err=>{
        console.log(err)
    });
    
})
// xet duyet bbai viet
router.post('/xetduyet', (req,res)=>{
    req.body.PostStatus=1;
    var id = req.body.ID;
    Promise.all([
        editorModle.xetDuyetPost(req.body),
        editorModle.getIDcategoryByPostID(id)
    ]).then(([id, CatID])=>{
        res.redirect('/editor/'+CatID[0].SuperCatID);
    }).catch();
    
})
// tu choi bai viet
router.post('/tuchoi',(req,res)=>{
    req.body.PostStatus=-1;
    var id = req.body.ID;
    Promise.all([
        editorModle.xetDuyetPost(req.body),
        editorModle.getIDcategoryByPostID(id)
    ]).then(([id, CatID])=>{ 
        res.redirect('/editor/'+CatID[0].SuperCatID);
    }).catch();
})

router.get('/profile-editor', (req, res) => {
    var isActive="pe";
    editorModle.allcategory().then(rows=>{
        res.render('editor/profile-editor', { "isActive": isActive , categories: rows});
    }).catch();
})
// router post update profile editor.
router.post('/update/profile-editor', (req,res)=>{
    var entity = req.body;


    res.end('...');
})

router.get('/security', (req, res) => {
    var isActive = "s";
    editorModle.allcategory().then(rows=>{
        res.render('editor/security', { "isActive": isActive , categories: rows});
    }).catch();
})

// xu li nay sau cung` vi no co cung root nếu muốn đổi root thì bỏ đâu cũng đc
router.get("/:iddm", (req, res) => {
    var iddanhmuc = req.params.iddm;
    Promise.all([
        editorModle.allcategory(),
        editorModle.allPostBycategory(iddanhmuc),
    ]).then(([rows, rowPostByCat])=>{
        for (let index = 0; index < rows.length; index++) {
           if(rows[index].ID===+iddanhmuc){
               var chuyenmuc = rows[index].CatName;
               rows[index].isActive = true;
           }
        }
        var isActive = "xdbv"; 
        res.render('editor/editor-index', { "isActive": isActive , "chuyenmuc": chuyenmuc , categories: rows , post: rowPostByCat});
        
    }).catch();
})

module.exports = router;