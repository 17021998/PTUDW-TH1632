var express = require('express');
var router = express.Router();

var chitietbaiveitModel = require('../../modles/chitietbaiviet/chitietbaiviet.modle');

router.post('/cmt',(req,res)=>{
  var entity = req.body;
  if(!req.user){
    console.log(1);
      entity.UserID = null;
  }else{
    entity.UserID = req.user.ID;
  }
  chitietbaiveitModel.addComment(entity)
  .then(id=>{
    res.end('success');
  })
  .catch();
})


// add cai nay cuoi cung
router.get('/:id', (req, res, next) => {
  var idP = req.params.id;
  if(idP < 1 || isNaN(idP)){
    idP = 1;
  }
  Promise.all([
    chitietbaiveitModel.allCat(),
    chitietbaiveitModel.getCat(idP),
    chitietbaiveitModel.single(idP),
    chitietbaiveitModel.getComment(idP)
  ]).then(([cats,cat , rows, rowsComment]) => {
    res.render('Chitietbaiviet/ctbv', {
      cats: cats,
      cat: cat[0],
      chitietbaiviet: rows[0],
      "comment": rowsComment
    });
  }).catch(next);
})


module.exports = router;