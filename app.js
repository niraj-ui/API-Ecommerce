//======================================
// get the packages we need ============
//======================================
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
var path = require('path');
var fs = require('fs');
var session = require('express-session');//middleware
var app = express();


//======================================
//connect to client ====================
//======================================

app.set('view engine', 'jade');
app.set('views', path.join(__dirname+'/server/views'));
//view engine setup ends

//======================================
//initialize middlewares ===============
//======================================
app.use(bodyParser.json({limit:'10mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb', extended:true}));
app.use(cookieParser());
 
 // for session store
app.use(session({
  name   : 'myCustomCookie',
  secret :  'myAppSecret',
  resave :  true,
  httpOnly :  true,
  saveUninitialized : true,
  cookie : {secure  : false}
}));
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
})

    

//======================================
//setup mongodb connection =============
//======================================
var dbURI = 'mongodb://localhost/helpdeskNew';
mongoose.connect(dbURI);
mongoose.connection.once('connected', function(){
    console.log(dbURI + ' Database connected')
});


//======================================
//include all model files using fs modules ===
//======================================
fs.readdirSync('./server/models').forEach(function(file){
    //check if file has .js extension
    if(file.indexOf('.js'));
    require('./server/models/' + file);
});


//======================================
//include all controllers files using fs modules ===
//======================================
fs.readdirSync('./server/controllers').forEach(function(file){
    //check if file has js extension
    if(file.indexOf('.js'));
    var route = require('./server/controllers/' + file);
    route.Controller(app);
})




//======================================
// listen on port ======================
//======================================
app.listen(8000, function(){
    console.log("listening... on port 8000")
})

