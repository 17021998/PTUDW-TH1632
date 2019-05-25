var express = require('express');
var router = express.Router();
var categoryModel = require('../../modles/categoty.modle');

router.post('/add', (req, res) => { 
    req.body.SuperCatID = null;
    // console.log(req.body); 
    categoryModel.add(req.body).then(id => {
        // console.log(req.body);
        res.redirect('/admin/qlChuyenMuc');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
})

router.get('/delete', (req,res)=>{
    
})

module.exports = router;