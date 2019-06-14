var express = require('express');
var router = express.Router();
var adminModle = require('../../modles/admin/admin.modle');

var dateFormat = require('dateformat');
var split = require('string-split');

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
        console.log(rowsPos);
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

router.get('/qlBaiViet', (req, res) => {
    var isActive = "qlbv";
    adminModle.allPost()
    .then(rows=>{
        for (let index = 0; index < rows.length; index++) {
            if(rows[index].ReleaseDay!=null)
                rows[index].ReleaseDay= dateFormat(rows[index].ReleaseDay, "yyyy/mm/dd");
        }
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
        res.render('admin/qlHashTag', { "isActive": isActive, tag: rows, "TagName": TagName});
    }).catch();
}) 

router.post('/deleteTag', (req,res)=>{
    var idTag= req.body.id;
    console.log(req.body);
    adminModle.deleteTag(idTag)
        .then(id => {
            res.end('...');
        })
        .catch(err=>console.log(err));

})

//Get subcribers
router.get('/qlNguoiDung/subcribers', (req, res) =>{
    var isActive = "qlnd";
    res.render('admin/user/qlNguoiDung-subcriber', {"isActive": isActive});
})

//Post subcriber
router.post('/qlNguoiDung/subcribers', (req, res, next) =>{
    var saltRounds = 10;
    var name = req.body.name;
    var email = req.body.email;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    var id = uuidv4();

    var entity1 = {
        ID: id,
        FullName: name,
        Email: email,
        PassHash: hash,
        role: 'user'
    };
    var entity2 = {
        UserID: id, 
        Status: 1
        //BeginDay: Date.now()
    };

    Promise.all([
        guestModel.add(entity1)
    ]).then(()=>{
        subcriberModel.add(entity2);
    }).catch(err=>{
        console.log(err);
    })
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
    // tag name add them.
    var tag = req.body.tagname;
    // id cua post can update.
    var ID = req.body.ID;
    var Arr = split(",", tag);
    delete req.body['tagname'];
    delete req.body['CatID'];
    var arr = {"idP" : ID, "idT": Arr};

    console.log(arr);

    Promise.all([
        adminModle.savePost(req.body),
        adminModle.getTagIDByName(arr)
    ])
    .then(([id, rows])=>{
        if(rows.length!=0){
            console.log(rows);
            var idT =[];
            for (let index = 0; index < rows.length; index++) {
                idT[index] = rows[index];
            }
            console.log(idT);
            var arr1 = {"idP" : ID, "idT": idT};

            adminModle.addTagPost(arr1)
            .then()
            .catch();
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
    delete req.body['tagname'];
    delete req.body['CatID'];
    var arr = {"idP" : ID, "idT": Arr};

    Promise.all([
        adminModle.savePost(req.body),
        adminModle.getTagIDByName(arr)
    ])
    .then(([id, rows])=>{
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
    delete req.body['tagname'];
    delete req.body['CatID'];
    var arr = {"idP" : ID, "idT": Arr};

    Promise.all([
        adminModle.savePost(req.body),
        adminModle.getTagIDByName(arr)
    ])
    .then(([id, rows])=>{
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
    console.log(req.body);
    adminModle.deleteTagPost(req.body.idT,req.body.idP)
    .then(id=>{
        res.end('...');
    })
    .catch();
})

module.exports = router;