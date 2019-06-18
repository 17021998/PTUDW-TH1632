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
router.get('/:id', (req, res) => {
  var idP = req.params.id;
  Promise.all([
    chitietbaiveitModel.allCat(),
    chitietbaiveitModel.single(idP),
    chitietbaiveitModel.getComment(idP)
  ]).then(([cats, rows, rowsComment]) => {
    res.render('Chitietbaiviet/ctbv', {
      cats: cats,
      chitietbaiviet: rows[0],
      "comment": rowsComment
    });
  }).catch(err => {
    console.log(err);
  });
})


module.exports = router;