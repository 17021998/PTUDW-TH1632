var express = require('express');
var router = express.Router();
var adminModle = require('../../modles/admin/admin.modle');

var dateFormat = require('dateformat');
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
        adminModle.getcategoryFather(),
        adminModle.getCatagoryChild(),
        adminModle.getPostByPostId(id),
        adminModle.getAllTagByPostID(id),
        ])
    .then(([rowsCat, rowC, rowsPos, rowsTag])=>{
        res.render('admin/ctBaiViet', { "isActive": isActive, "Cat": rowsCat, "CatChild": rowC , "post": rowsPos[0], "Tag": rowsTag});
    })
    .catch();
})


router.get('/newBaiViet', (req,res)=>{
    var isac = "nbv"
    adminModle.getcategoryFather()
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
// router post update profile admin
router.post('/update/profile-admin', (req,res)=>{
    var entity = req.body;

    res.end('...');
})

router.get('/qlBaiViet', (req, res) => {
    var isActive = "qlbv";
    var ttbv = req.query.ttbv || 2;
    var page = req.query.page || 1;
    if(page < 1 || isNaN(page)){
        page=1;
    } 
    if((ttbv <-2 && ttbv > 2)|| isNaN(ttbv)){
        ttbv=2; // xác nhận là lấy tất cả.
    } 
    var limit = 5;
    var offset = (page - 1) * limit;
    Promise.all([
        adminModle.countPost(),
        adminModle.pagePost(limit, offset, ttbv),
    ]).then(([count, rowsPage])=>{ 
        for (let index = 0; index < rowsPage.length; index++) {
            if(rowsPage[index].ReleaseDay!=null)
            rowsPage[index].ReleaseDay= dateFormat(rowsPage[index].ReleaseDay, "yyyy/mm/dd");
        }
        var dateNow = dateFormat(new Date() ,"yyyy/mm/dd");
        var counts = count[0].totals;
        var len = Math.floor(counts / limit);
        if(counts % limit>0){
            len++;
        }

        var lenPage=[];
        if(len < 5){
            lenPage.push({"begin": 0, "end": len-1});
        }else {
            if(page -2 <=1){
                lenPage.push({"begin": 0, "end": 4});
            } else if(page + 2>=len){
                lenPage.push({"begin": len-5, "end": len-1});
            }else {
                lenPage.push({"begin": page -2, "end": +page + 2});
            }
        }

        var pages = [];
        for( i =0 ;i<len;i++){
            pages.push({"value": i, "isActive": i===+page-1});
        }

        res.render('admin/qlBaiViet', { "isActive": isActive, baiviet: rowsPage, "page": pages, "p":page, "ttbv": ttbv, dateNow, "lenPage": lenPage[0]});
    }).catch();

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
    var page = req.query.page || 1; 
    if(page < 1 || isNaN(page)){
        page=1;
    }
    console.log(page);
    var limit = 10;
    var offset = (page - 1) * limit;
    Promise.all([
        adminModle.allTag(),
        adminModle.pageTag(limit,offset),
    ]).then(([rows, rowsPage])=>{ 
        var len = Math.floor(rows.length / limit);
        if(rows.length % limit>0){
            len++;
        }
        // len là so luong trang.
        var lenPage=[];
        if(len < 5){
            lenPage.push({"begin": 0, "end": len-1});
        }else {
            if(page -2 <=1){
                lenPage.push({"begin": 0, "end": 4});
            } else if(page + 2>=len){
                lenPage.push({"begin": len-5, "end": len-1});
            }else {
                lenPage.push({"begin": page -2, "end": +page + 2});
            }
        }
        var pages = [];
        for( i =0 ;i<len;i++){
            pages.push({"value": i, "isActive": i===+page-1});
        }
        res.render('admin/qlHashTag', { "isActive": isActive, tag: rowsPage, "page": pages, "p": page, "lenPage": lenPage[0] });
    }).catch();
}) 

router.post('/deleteTag', (req,res)=>{
    var idTag= req.body.id;
    adminModle.deleteTag(idTag)
        .then(id => {
            res.end('...');
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
        
        var today = new Date().toLocaleDateString();
        var todayFormat = momnet(today, 'MM/DD/YYYY').format('YYYY-MM-DD');
        var isActive = "qlnd";
        res.render('admin/user/qlNguoiDung-subcriber', {"isActive": isActive, rows: rows, pages,currentPage: currentPage, todayFormat});
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//Add new member
router.post('/qlNguoiDung/subcribers', (req, res, next) =>{
    var saltRounds = 10;
    var name = req.body.name;
    var email = req.body.email;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var id = uuidv4();

    var dob = momnet(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var today = new Date().toLocaleDateString();
    var beginDay = momnet(today, 'MM/DD/YYYY').format('YYYY-MM-DD');
    var currentDay = new Date();
    var endDay = new Date(currentDay.getTime() + 86400000*7); // + 7 day in ms

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
        BeginDay: beginDay,
        EndDay: endDay
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


//Update member
router.post('/qlNguoiDung/subcribers/update/:id', (req, res, next) =>{
    var id = req.params.id;
    var today = new Date().toLocaleDateString();
    var beginDay = momnet(today, 'MM/DD/YYYY').format('YYYY-MM-DD');
    var currentDay = new Date();
    var endDay = new Date(currentDay.getTime() + 86400000*7); // + 7 day in ms
    var entity = {
        UserID: id, 
        Status: 1,
        BeginDay: beginDay,
        EndDay: endDay
    };  
    console.log(entity);
    subcriberModel.update(entity)
    .then(()=>{
        return res.redirect('/admin/qlNguoiDung/subcribers');
    }).catch(err=>{
        console.log(err);
    }).catch(next);
})
//Delete member
router.post('/qlNguoiDung/subcribers/delete/:id', (req, res, next) =>{
    var id = req.params.id;
    subcriberModel.delete(id)
    .then(()=>{
        return res.redirect('/admin/qlNguoiDung/subcribers');
    }).catch(err=>{
        console.log(err);
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
// update user infor
router.post('/update/user-info', (req,res)=>{
    var entity = req.body;

    res.end('...');
})

router.get('/writer-info', (req, res) => {
    var isActive = "wi";
    res.render('admin/writer-info', { "isActive": isActive });
})
// update writer infor
router.post('/update/writer-info', (req,res)=>{
    var entity = req.body;

    res.end('...');
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
    // tag name add them.
    var tag = req.body.tagname;
    if(req.body.PostStatus=="null"){
        req.body.PostStatus = null;
        req.body.ReleaseDay = null;
    }
    // id cua post can update.
    var ID = req.body.ID;
    var Arr = split(",", tag);
    delete req.body['tagname'];
    var CatId = req.body.CatID;

    var entity={
        CatID: CatId,
        PostID: ID
    };

    delete req.body['CatID'];
    var arr = {"idP" : ID, "idT": Arr};

    Promise.all([
        adminModle.savePost(req.body),
        adminModle.getTagIDByName(arr),
        adminModle.updateCatPost(entity),
    ])
    .then(([id, rows, rowCatPost])=>{
        if(rows.length!=0){
            var idT =[];
            for (let index = 0; index < rows.length; index++) {
                idT[index] = rows[index];
            }
            var arr1 = {"idP" : ID, "idT": idT};

            adminModle.addTagPost(arr1)
            .then().catch();
        }
        res.redirect('/admin/'+ID+'/ctBaiViet');
    })
    .catch();

})

router.post('/saveClose/baiviet',(req,res)=>{

    // tag name add them.
    var tag = req.body.tagname;
    // id cua post can update.
    var ID = req.body.ID;
    var Arr = split(",", tag);
    var entity = {
        CatID: req.body.CatID,
        PostID: ID
    };
    delete req.body['tagname'];
    delete req.body['CatID'];
    var arr = {"idP" : ID, "idT": Arr};

    Promise.all([
        adminModle.savePost(req.body),
        adminModle.getTagIDByName(arr),
        adminModle.updateCatPost(entity),
    ])
    .then(([id, rows, rowsCatPost])=>{
        if(rows.length!=0){
            var idT =[];
            for (let index = 0; index < rows.length; index++) {
            idT[index] = rows[index];
            }
            var arr1 = {"idP" : ID, "idT": idT};
            adminModle.addTagPost(arr1)
            .then()
            .catch();
        }

        res.redirect('/admin/qlBaiViet');
    })
    .catch();

})

router.post('/saveNew/baiviet',(req,res)=>{
    // tag name add them.
    var tag = req.body.tagname;
    // id cua post can update.
    var ID = req.body.ID;
    var Arr = split(",", tag);
    var entity={
        CatID: req.body.CatID,
        PostID: req.body.PostID
    };
    delete req.body['tagname'];
    delete req.body['CatID'];
    var arr = {"idP" : ID, "idT": Arr};

    Promise.all([
        adminModle.savePost(req.body),
        adminModle.getTagIDByName(arr),
        adminModle.updateCatPost(entity),
    ])
    .then(([id, rows, rowCatPost])=>{
        if(rows.length!=0){
            var idT =[];
            for (let index = 0; index < rows.length; index++) {
            idT[index] = rows[index];
            }
            var arr1 = {"idP" : ID, "idT": idT};
            adminModle.addTagPost(arr1)
            .then().catch();
        }
        res.redirect('/admin/newBaiViet');
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
    adminModle.deleteTagPost(req.body.idT,req.body.idP)
    .then(id=>{
        res.end('...');
    })
    .catch();
})

module.exports = router;