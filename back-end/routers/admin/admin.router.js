var express = require('express');
var router = express.Router();
var adminModle = require('../../modles/admin/admin.modle');
var split = require('string-split');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var guestModel = require('../../modles/guest/guest.model');
var subcriberModel = require('../../modles/subcriber/subcriber.modle');
var momnet = require('moment');

router.get('/:id/ctBaiViet', (req, res) => {
    var isActive = "ctbv";
    var id = req.params.id;
    Promise.all([
        adminModle.getCatagory(),
        adminModle.getPostByPostId(id),
        // thiếu lấy các tag thuộc post đó.
        adminModle.getAllTagByPostID(id),
        ])
    .then(([rowsCat, rowsPos, rowsTag])=>{
        console.log(rowsTag);
        res.render('admin/ctBaiViet', { "isActive": isActive, "Cat": rowsCat, "post": rowsPos[0], "Tag": rowsTag});
    })
    .catch();
})


router.get('/newBaiViet', (req,res)=>{
    var isac = "nbv"
    adminModle.getCatagory()
    .then(rows=>{
        res.render('admin/newBaiViet',{"isActive": isac, "Cat": rows});
    })
    .catch();
})

router.get('/editor-info', (req, res) => {
    var isActive = "ei";
    res.render('admin/editor-info', { "isActive": isActive });
})

router.get('/profile-admin', (req, res) => {
    var isActive = "pa";
    res.render('admin/profile-admin', { "isActive": isActive });
})

router.get('/qlBaiViet', (req, res) => {
    var isActive = "qlbv";
    adminModle.allPost()
    .then(rows=>{
        res.render('admin/qlBaiViet', { "isActive": isActive, baiviet: rows });
    })
    .catch(err=>{
        console.log(err);
        res.end('error');
    });
    // res.render('admin/qlBaiViet', { "isActive": isActive });
})

router.get('/qlChuyenMuc', (req, res) => {
    adminModle.allCatagoty()
    .then(rows => {
        var isActive = "qlcm";
    res.render('admin/qlChuyenMuc', { "isActive": isActive , rows: rows });
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})
// quản lí hashtag
router.get('/qlHashTag', (req, res) => {
    var isActive = "qlht";
    Promise.all([
        adminModle.allTag(),
        // adminModle.getAllTagName()
    ]).then(([rows])=>{ 
        //console.log(rowsTag);
        var TagName = [];
        for(let i=0;i<rows.length;i++){
            TagName[i]=rows[i].TagName;
        }
        console.log(TagName);
        res.render('admin/qlHashTag', { "isActive": isActive, tag: rows, "TagName": TagName});
    }).catch();
}) 

router.get('/:id/deleteTag', (req,res)=>{
    var idTag= req.params.id;
    adminModle.deleteTag(idTag)
        .then(id => {
            res.redirect("/admin/qlHashTag");
        })
        .catch(err=>console.log(err));

})

router.get('/qlNguoiDung', (req, res) => {
    var isActive = "qlnd";
    res.render('admin/qlNguoiDung', { "isActive": isActive });
})

router.get('/qlNguoiDung/subcribers', (req, res) =>{
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 4;
    var offset = (page - 1)*limit;
    Promise.all([
        subcriberModel.pageBySubcriber(limit, offset),
        subcriberModel.countBySubcriber(),
    ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        var currentPage = 1;
        for( i = 1; i <= nPages; i++){
            var obj = {value: i};
            pages.push(obj);
        }
        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
            }
        var isActive = "qlnd";
        res.render('admin/user/qlNguoiDung-subcriber', {"isActive": isActive, rows: rows, pages,currentPage: currentPage});
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

router.post('/qlNguoiDung/subcribers', (req, res, next) =>{
    var saltRounds = 10;
    var name = req.body.name;
    var email = req.body.email;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var id = uuidv4();
    var dob = momnet(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var today = new Date().toLocaleDateString();
    var beginDay = momnet(today, 'MM/DD/YYYY').format('YYYY-MM-DD');

    var entity1 = {
        ID: id,
        FullName: name,
        Email: email,
        PassHash: hash,
        role: 'user',
        DoB: dob
    };
    var entity2 = {
        UserID: id, 
        Status: 1,
        BeginDay: beginDay
    };

    guestModel.add(entity1)
    .then(()=>{
        subcriberModel.add(entity2)
        .then(()=>{
            return res.redirect('/admin/qlNguoiDung/subcribers');
        }).catch(err=>{
        console.log(err);
        })
    }).catch(next);
})

router.get('/security', (req, res) => {
    var isActive = "s";
    res.render('admin/security', { "isActive": isActive });
})

router.get('/user-info', (req, res) => {
    var isActive = "ui";
    res.render('admin/user-info', { "isActive": isActive });
})
router.get('/writer-info', (req, res) => {
    var isActive = "wi";
    res.render('admin/writer-info', { "isActive": isActive });
})


// router post
router.post('/qlHashTag/add', (req,res)=>{
    var tagname= req.body.tagname;
    var Arr = split(",", tagname);
    adminModle.addTag(Arr)
        .then(id=>{
            res.redirect("/admin/qlHashTag");
        })
        .catch(err => console.log(err));
})

router.post('/save/baiviet',(req,res)=>{
    delete req.body['CatID'];
    adminModle.savePost(req.body)
    .then(id=>{
        res.redirect('/admin/'+id+'/ctBaiViet');
    })
    .catch();

})

router.post('/saveClose/baiviet',(req,res)=>{
    delete req.body['CatID'];
    adminModle.savePost(req.body)
    .then(id=>{
        res.redirect('/admin/qlBaiViet');
    })
    .catch();

})

router.post('/saveNew/baiviet',(req,res)=>{
    delete req.body['CatID'];
    Promise.all([
        adminModle.savePost(req.body),
    ]).then(([id])=>{
        res.redirect('/admin/newBaiViet');
    }).catch();
    adminModle.savePost(req.body)
    .then(id=>{
        
    })
    .catch();

})

router.post('/delete/baiviet',(req,res)=>{
    adminModle.deletePost(req.body.ID)
    .then( id => {
        res.redirect('/admin/qlBaiViet');
    })
    .catch();
})

router.post('/deleteTagPost',(req,res)=>{
    console.log(req.body);
    adminModle.deleteTagPost(req.body.idT,req.body.idP)
    .then(id=>{
        res.end('...');
    })
    .catch();
})

module.exports = router;