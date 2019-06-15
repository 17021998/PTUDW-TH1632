var express = require('express');
var router = express.Router();
var categoryModel = require('../../modles/categoty.modle');
var auth = require('../../middlewares/auth');

router.get('/', auth, (req, res, next) => {
    var p = categoryModel.all();
    p.then(rows => {
        res.render('admin/qlChuyenMuc', { 
            rows: rows,
            isActive:"qlcm"
        });
    })
    .catch(next);
})

router.post('/add', (req, res, next) => {
    categoryModel.add(req.body).then(id => {
        res.redirect('/admin/categories')
    }).catch(next);
});
//Thêm category con
router.post('/:id/add', (req, res, next) => {
    var scID = req.params.id;
    req.body.SuperCatID = scID;
    categoryModel.add(req.body).then(() => {
        res.redirect('/admin/categories');
    }).catch(next);
});

router.post('/edit/:id', (req, res, next) => {
    var CatID = req.params.id;
    req.body.ID = CatID;
    categoryModel.update(req.body).then( () =>{
        res.redirect('/admin/categories');
    }).catch(next);
});

router.post('/delete/:id', (req, res, next) => {
    var catID = req.params.id;
    categoryModel.delete(catID).then(() =>{
        res.redirect('/admin/categories');
    }).catch(next)
});

module.exports = router;