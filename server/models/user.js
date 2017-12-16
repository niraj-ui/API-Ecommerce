// create user schcema start 

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
   
    name: String,
    email: String,
    password: String,
    mobile:String
  
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};  

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);

// create user schcema end *****************************************