module.exports = (req,res,next)=>{
    if(!req.user){
        res.redirest('/guest/login');
    }else{
        next();
    }
}