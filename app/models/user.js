var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
   local: {
        email : String,
        password : String,
    },
  good_subject: String,
  bad_subject: String,
  quiz:{
    key1: String,
    key2: String,
    key3: String,
    key4: String,
    key5: String

  },
  created_at: Date,
  updated_at: Date
});

// generating a hash
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)};

//checking if password is valid 
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);

};


// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;
