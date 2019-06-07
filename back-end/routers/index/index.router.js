var express = require('express');
var router = express.Router();
var indexModel = require('../../modles/index/index.model');

router.get('/', (req, res) => {
    Promise.all([
        indexModel.allCat()
    ]).then(([cats]) => {
        res.render('index',{
            cats:cats
        });
    }).catch(err => {
        console.log(err);
    });
})

router.post('/searchAutoComplete',(req,res)=>{
    // xu li cho nay
    var data = req.body;

    indexModel.searchTag(data)
    .then(rows=>{
        console.log(rows);
        var TagName = [];
        for(let i=0;i<rows.length;i++){
            TagName[i]=rows[i].TagName;
        }

        res.end(""+TagName);
    })
    .catch();
})

module.exports = router;
