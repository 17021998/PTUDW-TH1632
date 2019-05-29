var express = require('express');
var router = express.Router();
var categoryModel = require('../../modles/categoty.modle');

router.get('/', (req, res) => {
    var p = categoryModle.all();
    p.then(cats => {
        res.render('admin/qlChuyenMuc', { 
            cats: cats,
            isActive:"qlcm"
        });
    })
    .catch(err => {
        console.log(err);
    });
})

router.post('/add', (req, res) => {
    categoryModle.add(req.body).then(id => {
        res.redirect('/admin/categories')
    }).catch(err =>{
        console.log(err);
        res.end("error occured");
    });
});
//Thêm category con
router.post('/:id/add', (req, res) => {
    var scID = req.params.id;
    req.body.SuperCatID = scID;
    categoryModle.add(req.body).then(() => {
        res.redirect('/admin/categories');
    }).catch(err =>{
        console.log(err);
        res.end("error occured");
    });
});

router.post('/edit/:id', (req, res) => {
    var CatID = req.params.id;
    req.body.ID = CatID;
    categoryModle.update(req.body).then( () =>{
        res.redirect('/admin/categories');
    }).catch(err => {
        console.log(err);
        res.end("error occured");
    })
});

router.post('/delete/:id', (req, res) => {
    var catID = req.params.id;
    categoryModle.delete(catID).then(() =>{
        res.redirect('/admin/categories');
    }).catch(err => {
        console.log(err);
        res.end("error occured");
    })
});

module.exports = router;