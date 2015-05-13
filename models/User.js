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

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew && (this.basic.password.length != 0)) {
        bcrypt.genSalt(8, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.basic.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.basic.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.checkPassword = function(password) {
  bcrypt.compare(password, this.basic.password, function(err, result) {
    if(err) { 
      console.log(err);
      return console.log('there was an error'); 
    }
    if(result) {
      return console.log('correct password');
    } else {
      return console.log('incorrect password');
    }
  });
};

module.exports = mongoose.model('User', userSchema);

