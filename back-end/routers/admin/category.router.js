var express = require('express');
var router = express.Router();
var categoryModel = require('../../modles/categoty.modle');

router.get('/', (req, res) => {
    var p = categoryModel.all();
    p.then(rows => {
        res.render('admin/qlChuyenMuc', { 
            rows: rows,
            isActive:"qlcm"
        });
    })
    .catch(err => {
        console.log(err);
    });
})

router.post('/add', (req, res) => {
    categoryModel.add(req.body).then(id => {
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
    categoryModel.add(req.body).then(() => {
        res.redirect('/admin/categories');
    }).catch(err =>{
        console.log(err);
        res.end("error occured");
    });
});

router.post('/edit/:id', (req, res) => {
    var CatID = req.params.id;
    req.body.ID = CatID;
    categoryModel.update(req.body).then( () =>{
        res.redirect('/admin/categories');
    }).catch(err => {
        console.log(err);
        res.end("error occured");
    })
});

router.post('/delete/:id', (req, res) => {
    var catID = req.params.id;
    categoryModel.delete(catID).then(() =>{
        res.redirect('/admin/categories');
    }).catch(err => {
        console.log(err);
        res.end("error occured");
    })
});

module.exports = router;