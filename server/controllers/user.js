//======================================
// get the packages we need ============
//======================================
var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var userRouter = express.Router();
 
var responseGenerator = require('../libs/response-generator');
module.exports.Controller = function(app){

 userRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

userRouter.get('/login', function(req, res, next) {
  res.render('login.jade', {  });
});

userRouter.get('/signup', function(req, res) {
  res.render('signup.jade', {  });
});

userRouter.get('/profile', /*isLoggedIn,*/ function(req, res) {
    console.log(req.session.user.name)
  res.render('profile.jade', { user: req.session.user });
    console.log(req.session.user.name);
});

userRouter.get('/forget', function(req, res) {
res.render('forget-password.jade', {  });
});
 
// for forget password

userRouter.post('/reset', function(req,res){
    User.findOne({'email':req.body.email}, function(err, user){
         
        user.password = req.body.password;
        
         user.save(function(err){
        if(err){
            var myResponse = responseGenerator.generate(true, "Some error occured"+err, 500, null);
            res.render('error',{
                message :  response.message,
                error   :  response.data
            });
        }else{
            console.log('password reset')
            res.redirect('/user/login')
        }
         
    })
})
});    
 
 // for signup APi 
userRouter.post('/signup', function(req,res){
    if(req.body.name!=undefined && req.body.password!=undefined && req.body.email!=undefined && req.body.mobile!=undefined )
        {
            var newUser=new User({
                name:req.body.name,
                password:req.body.password,
                email:req.body.email,
                mobile:req.body.mobile
            }); 
            console.log(newUser);
            newUser.save(function(err){
                if(err) {console.log(err)}
                else{
                    req.session.user=newUser;
                    delete req.session.user.password;
                    res.redirect('/user/profile');
                }
            })
        }
    else { console.log('body parameter is missing')};
});
    
    
    // user logout API
    userRouter.get('/logout',function(req,res){
        req.session.destroy(function(err){
            if(err){console.log(err)}
            else{console.log('user log out');}
        });
        res.redirect('/user/login');
    });
    
// user login API
    userRouter.post('/login', function(req,res){
    
    User.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]}, function(err, foundUser){
        if(err){
            console.log('foundUser');
            var myResponse = responseGenerator.generate(true, "some error occured"+err, 500, null);
            
            res.render('error',{
                message  :  response.message,
                error    :  responseGenerator.data
            });
        }else if(foundUser == null || foundUser == undefined || foundUser.name == undefined ){
             console.log(foundUser);
            res.render('error');
        }else{
                    req.session.user = foundUser;
                    delete req.session.user.password;
                    res.redirect('/user/profile');                
        }
    })

    })
    
    // 
 userRouter.get('/all',function(req,res){
   User.find({},function(err,status){
      if(err){console.log(err)}
       else{/*res.send(status)*/
       res.render('all-user.jade',{status:status}); 
       }
   });  
 }); 
    
    
userRouter.post('/all/:id',function(req,res){
    User.findById(req.params.id, function(err,status){
        if(err) {console.log(err)}
        else{ 
        status.remove(function(err){
            if(err){console.log(err)}
            else{res.send(status);            
            }
        })
        }
    })
})    
    
   //  roduct delete 
    userRouter.get('/delete/:id', function(req,res){
        console.log(req.params.id);
        User.findById({_id:req.params.id},function(err,status){
            console.log(status);
            if(err){console.log(err)}
            else{ status.remove(function(err){
                if(err){console.log(err)}
                else{ res.redirect('/user/all'); }
            }) }
        })
    })
    
//===================================================
// use app level middleware =========================
//===================================================
app.use('/user', userRouter)
}