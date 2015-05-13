'use strict';

var User = require('../models/User.js');
var bodyparser = require('body-parser');

module.exports = function(router) {
  router.use(bodyparser.json());

  router.post('/create_user', function(req, res) {
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.basic.email = req.body.email;
    newUser.basic.password = req.body.password;
    newUser.save(function(err, data) {
      if(err) {
        console.log(err);
        res.status(500).json({msg: 'could not create user'});
      }
      console.log(data);
      res.json({msg: 'user created'});
    });
  });
};