'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  basic: {
    email: { type: String, unique: true },
    password: String
  }
});

userSchema.methods.generateHash = function(password, callback) {
  bcrypt.genSalt(8, function(err, salt) {
    if(err) {
      return console.log(err);
    }
    bcrypt.hash(password, salt, null, function(err, hash) {
      if(err) {
        return console.log(err);
      }
      return callback(null, hash);
    });
  });
};

userSchema.methods.checkPassword = function(password) {
  bcrypt.compare(password, this.basic.password, function(err, result) {
    if(err) { 
      console.log(err);
      return console.log('there was an error'); 
    }
    return result = true; 
  });
};

module.exports = mongoose.model('User', userSchema);
