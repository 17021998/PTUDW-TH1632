var express = require('express');
var router = express.Router();
var adminModle = require('../../modles/admin/admin.modle');
var dateFormat = require('dateformat');
var split = require('string-split');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var guestModel = require('../../modles/guest/guest.model');
var subcriberModel = require('../../modles/subcriber/subcriber.modle');
var editorModel = require('../../modles/editor/editor.modle');
var writerModel = require('../../modles/writer/writer.modle');
var categoryModel = require('../../modles/categoty.modle');
var momnet = require('moment');
var passport = require('passport');
var auth = require('../../middlewares/auth');
var isLogin = require('../../middlewares/checkLogInOut');

// Đăng nhập đăng xuất
router.get('/login',isLogin, (req, res) => {
    res.render('guest/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('guest/login', {
                layout: false,
                error: info.message
            });
        }
        var retUrl = req.session.retUrl || '/admin/profile-admin';
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            if (user.role == 'admin') {
                return res.redirect(retUrl);
            }
            //nếu là không phải admin thì ra 404
            return res.render('404');
        });
    })(req, res, next);
});

router.post('/logout' ,auth , (req, res, next) => {
    req.session.retUrl = null;
    req.logOut();
    res.redirect('/admin/login');
});
// Kết thúc đăng nhập đăng xuất

router.get('/:id/ctBaiViet',auth, (req, res) => {
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

router.get('/newBaiViet',auth, (req,res,next)=>{
    var isac = "nbv"
    Promise.all([
        adminModle.getcategoryFather(),
        adminModle.getCatagoryChild()
    ])
    .then(([ catF, catC])=>{
        res.render('admin/newBaiViet',{"isActive": isac, "Cat": catF, "CatChild": catC});
    })
    .catch(next);
})

router.get('/editor-info',auth, (req, res) => {
    var isActive = "ei";
    res.render('admin/editor-info', { "isActive": isActive });
})

router.get('/profile-admin',auth, (req, res) => {
    var isActive = "pa";
    res.render('admin/profile-admin', { "isActive": isActive });
})
// router post update profile admin
router.post('/update/profile-admin', (req,res, next)=>{
    var entity = req.body;
    var name = req.body.FullName||1
    var mail = req.body.Email || 1;
    if( name!=1 ){ 
        req.user.FullName = name;
    }
    if( mail!=1 ){ 
        req.user.Email = mail;
    }
        adminModle.updateUserPrimary(entity)
        .then((id)=>{
            res.end('sucess');
        })
        .catch(()=>res.end('err'));
})

router.get('/qlBaiViet',auth, (req, res,next) => {
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
        adminModle.countPost(ttbv),
        adminModle.pagePost(limit, offset, ttbv), // lay duoc danh sach cac post 
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
        if(len!=0){
            for( i =0 ;i<len;i++){
                pages.push({"value": i, "isActive": i===+page-1});
            }
        }else{
            pages.push({"value": 0, "isActive": true});
        }

        res.render('admin/qlBaiViet', { "isActive": isActive, baiviet: rowsPage, "page": pages, "p":page, "ttbv": ttbv, dateNow, "lenPage": lenPage[0]});
    }).catch(next);

})

router.get('/qlChuyenMuc',auth, (req, res,next) => {
    adminModle.allCatagoty()
    .then(rows => {
        var isActive = "qlcm";
    res.render('admin/qlChuyenMuc', { "isActive": isActive , rows: rows });
    }).catch(next);
})
// quản lí hashtag
router.get('/qlHashTag',auth, (req, res, next) => {
    var isActive = "qlht";
    var page = req.query.page || 1; 
    if(page < 1 || isNaN(page)){
        page=1;
    }
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
        if(len!=0){
            for( i =0 ;i<len;i++){
                pages.push({"value": i, "isActive": i===+page-1});
            }
        }else{
            pages.push({"value": 0, "isActive": true});
        }
        res.render('admin/qlHashTag', { "isActive": isActive, tag: rowsPage, "page": pages, "p": page, "lenPage": lenPage[0] });
    }).catch(next);
}) 

router.post('/deleteTag', (req,res,next)=>{
    var idTag= req.body.id;
    adminModle.deleteTag(idTag)
        .then(id => {
            res.end('...');
        })
        .catch(next);

})

//Load Nguoi Dung
router.get('/qlNguoiDung',auth, (req, res) => {
    Promise.all([
        subcriberModel.someSubcriber(8),
        writerModel.someWriter(4),
        editorModel.someEditor(4)
    ]).then(([ss, ws, es])=>{
        var today = new Date().toLocaleDateString();
        var todayFormat = momnet(today, 'MM/DD/YYYY').format('YYYY-MM-DD');
        var isActive = "qlnd";
        res.render('admin/qlNguoiDung', { "isActive": isActive, subcribers: ss, writers: ws, editors: es, todayFormat });
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//Load meber
router.get('/qlNguoiDung/subcribers',auth, (req, res) =>{
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 10;
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
        }).catch(next)
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
    subcriberModel.update(entity)
    .then(()=>{
        return res.redirect('/admin/qlNguoiDung/subcribers');
    }).catch(next).catch(next);
})

//Delete member
router.post('/qlNguoiDung/subcribers/delete/:id', (req, res, next) =>{
    var id = req.params.id;
    subcriberModel.delete(id)
    .then(()=>{
        return res.redirect('/admin/qlNguoiDung/subcribers');
    }).catch(next).catch(next);
})

//Load editor
router.get('/qlNguoiDung/editors',auth, (req, res) =>{
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 8;
    var offset = (page - 1)*limit;
    Promise.all([
        editorModel.pageByEditor(limit, offset),
        editorModel.countByEditor(),
        categoryModel.allOnlyCat()
    ]).then(([rows, count_rows, cats]) => {
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
        res.render('admin/user/qlNguoiDung-editor', {"isActive": isActive, rows: rows, pages,currentPage: currentPage, cats});
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//Add new editor
router.post('/qlNguoiDung/editors', (req, res, next) =>{
    var saltRounds = 10;
    var name = req.body.name;
    var email = req.body.email;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var id = uuidv4();
    var checkCats = [];
    checkCats = req.body.checkCat;  
    var dob = momnet(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
    
    var entity1 = {
        ID: id,
        FullName: name,
        Email: email,
        PassHash: hash,
        role: 'editor',
        DoB: dob
    };
    guestModel.add(entity1)
    .then(()=>{
        for(let i = 0; i< checkCats.length; i++){
            var entity2 = {
                UserID: id,
                ManagedCatID: checkCats[i]
            };
            editorModel.addNewEditor(entity2)
        }
    })
    .then(()=>{
            return res.redirect('/admin/qlNguoiDung/editors');
    }).catch(next);
})

//Delete editor
router.post('/qlNguoiDung/editors/delete/:id', (req, res, next) =>{
    var id = req.params.id;
    editorModel.delete(id)
    .then(()=>{
        return res.redirect('/admin/qlNguoiDung/editors');
    }).catch(err=>{
        console.log(err);
    }).catch(next);
})

//Load writer
router.get('/qlNguoiDung/writers',auth, (req, res) =>{
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var limit = 8;
    var offset = (page - 1)*limit;
    Promise.all([
        writerModel.pageWriter(limit, offset),
        writerModel.countByWriter()
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
        res.render('admin/user/qlNguoiDung-writer', {"isActive": isActive, rows: rows, pages,currentPage: currentPage});
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//Add new writers
router.post('/qlNguoiDung/writers', (req, res, next) =>{
    var saltRounds = 10;
    var name = req.body.name;
    var nickname = req.body.nickname;
    var email = req.body.email;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var id = uuidv4();
    var dob = momnet(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');

    var entity1 = {
        ID: id,
        FullName: name,
        Email: email,
        PassHash: hash,
        role: 'writer',
        DoB: dob
    };
    var entity2 = {
        UserID: id, 
        WriterName: nickname
    };

    guestModel.add(entity1)
    .then(()=>{
        writerModel.add(entity2)
        .then(()=>{
            return res.redirect('/admin/qlNguoiDung/writers');
        }).catch(next)
    }).catch(next);
})

//Delete writer
router.post('/qlNguoiDung/writers/delete/:id', (req, res, next) =>{
    var id = req.params.id;
    writerModel.delete(id)
    .then(()=>{
        return res.redirect('/admin/qlNguoiDung/writers');
    }).catch(err=>{
        console.log(err);
    }).catch(next);
})

//Load info of userprimary
router.get('/qlNguoiDung/user-info/:id', (req, res) => {
    var id = req.params.id;
    Promise.all([
        editorModel.singleEditor(id),
        categoryModel.allOnlyCat(),
        editorModel.catOfEditor(id)
    ])
    .then(([neditor, cats, editorCat]) => {
        var isActive = "qlnd";
    res.render('admin/user/user-info', { "isActive": isActive , neditor, cats, editorCat});
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//Edit info of userprimary
router.post('/qlNguoiDung/user-info/:id', (req, res, next) =>{
    var checkCats ;
    var id = req.params.id;
    checkCats = req.body.checkCat;
    var entities = [];
    for(let i = 0; i< checkCats.length; i++){
        var entity = {
            UserID: id,
            ManagedCatID: checkCats[i]
        };
        entities.push(entity);
    }
    console.log(entities);
    
    editorModel.updateCatOfEditor(id, entities)
    .then(()=>{
        var url = `/qlNguoiDung/user-info/${id}`;
        var isActive = "qlnd";
        res.render(url, { "isActive": isActive});
    }).catch(next);
})

router.get('/security',auth, (req, res) => {
    var isActive = "s";
    res.render('admin/security', { "isActive": isActive });
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

router.post('/save/bv',(req,res)=>{
    // tag name add them.
    var tag = req.body.tagname;
    if(req.body.PostStatus=="null"){
        req.body.PostStatus = null;
        req.body.ReleaseDay = null;
    }
    req.body.ReleaseDay = null;
    req.body.editorID = null;
    req.body.Abstract = req.body.Title;
    req.body.Premium = 0;
    req.body.Deny = null;
    req.body.editorID = req.user.ID;
    if(req.body.PostStatus == 1){
        req.body.ReleaseDay = dateFormat(new Date(),"yyyy/mm/dd" );
    }
    // id cua post can update.
    var Arr = split(",", tag);
    delete req.body['tagname'];
    var CatId = req.body.CatID;
    delete req.body['CatID'];
    var arr = {"idT": Arr};
    Promise.all([
        adminModle.addPost(req.body),
        adminModle.getTagIDByName(arr)
    ])
    .then(([id, rowTag])=>{
        var catPost={
            'CatID': CatId,
            'PostID': id
        };
        
        Promise.all([
            adminModle.addCatPost(catPost)
        ]).then(([id1])=>{}).catch();

        if(rowTag.length!=0){   
            var idT =[];
            for (let index = 0; index < rowTag.length; index++) {
                idT[index] = rowTag[index];
            }
            var arr1 = {"idP" : id, "idT": idT};

            adminModle.addTagPost(arr1)
            .then().catch();
        }
        res.redirect('/admin/newBaiViet');
    }).catch();


})

router.post('/save/baiviet',(req,res)=>{
    // tag name add them.
    var tag = req.body.tagname;
    if(req.body.PostStatus=="null"){
        req.body.PostStatus = null;
        req.body.ReleaseDay = null;
    }
    if(req.body.PostStatus == 1){
        req.body.ReleaseDay = dateFormat(new Date(),"yyyy/mm/dd" );
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
    if(req.body.PostStatus=="null"){
        req.body.PostStatus = null;
        req.body.ReleaseDay = null;
    }
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
    if(req.body.PostStatus=="null"){
        req.body.PostStatus = null;
        req.body.ReleaseDay = null;
    }
    // id cua post can update.
    var ID = req.body.ID;
    var Arr = split(",", tag);
    var entity={
        CatID: req.body.CatID,
        PostID: req.body.ID
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