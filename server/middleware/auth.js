exports.checkLogin=function(req,res,next){
    if(!req.session && !reqsession.user){
        res.redirect('/user/login');
        }
    else{
        next();
    }
}