var express = require('express');
var router = express.Router();


router.get('/', (req,res)=> {
    res.render('editor/editor-index');
})

router.get('/profile-editor', (req,res)=>{
    res.render('editor/profile-editor');
})

router.get('/sercurity', (req,res)=>{
    res.render('editor/sercurity');
})


module.exports = router;