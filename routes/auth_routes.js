'use strict';

var User = require('../models/User.js');
var bodyparser = require('body-parser');

module.exports = function(router, passport) {
  router.use(bodyparser.json());

  router.post('/create_user', function(req, res) {
    //add layer of protection
    var newUserData = JSON.parse(JSON.stringify(req.body));
    delete newUserData.email;
    delete newUserData.password;

    var newUser = new User(newUserData);
    newUser.username = req.body.username;
    newUser.basic.email = req.body.email;
    newUser.basic.password = newUser.generateHash(req.body.password, function(err, hash) {
      if(err) {
        console.log(err);
        res.status(500).json({msg: 'could not save password'});
      }

      newUser.basic.password = hash;
    });
    newUser.save(function(err, data) {
      if(err) {
        console.log(err);
        res.status(500).json({msg: 'could not create user'});
      }
      console.log(data);
      res.json({msg: 'user created'});
    });
  });

  router.get('/signin', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({msg: 'authenticated as ' + req.user.basic.email});
  });
};