var express = require('express');
var router = express.Router();
var indexModel = require('../../modles/index/index.model');

router.get('/', (req, res, next) => {
    Promise.all([
        indexModel.allCat(),
        indexModel.topThreeWeek(),
        indexModel.topMostTen(),
        indexModel.topNewTen(),
        //indexModel.topTenCate()
    ]).then(([cats, three, mosts,news]) => {
        SplitImage(three);
        console.log(three);
        SplitImage(news);
        return res.render('index',{
            cats:cats,
            three: three,
            mosts : mosts,
            news : news
        });
    }).catch(next);
})

router.post('/searchAutoComplete',(req,res)=>{
    // xu li cho nay
    var data = req.body;

    indexModel.searchTag(data)
    .then(rows=>{
        var TagName = [];
        for(let i=0;i<rows.length;i++){
            TagName[i]=rows[i].TagName;
        }

        res.end(""+TagName);
    })
    .catch();
});

module.exports = router;


const SplitImage = (rows) => {
    for(var i = 0;i<rows.length; i++){
        var imgStr = rows[i].ImageAbstract;
        var arr = imgStr.split(/[""]/);
        rows[i].ImageAbstract = arr[1];
    }
}