'use strict';

//db for testing only
process.env.MONGOLAB_URI = 'mongodb://localhost/pet_test';
require('../server.js');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var eat = require('eat')

var Pet = require('../models/Pet.js');
var User = require('../models/User.js');

describe('Pet REST API', function() {
  var saveUserToken = '';

  before(function(done) {
    var petTest = new Pet({name: 'taffy', ownder: 'homie', weight: 55, type: 'dog'});
    petTest.save(function(err, data) {
      if(err) {
        console.log(err);
        return;
      }

      this.petTest = data;
      done();
    }.bind(this));

    var testUser = new User({'username': 'test', 'basic.email': 'test@example.com', 'basic.password': 'foobar123'});

    testUser['basic.password'] = testUser.generateHash(testUser['basic.password'], function(err, hash) {
      console.log('i am in generate hash');
      if(err) {
        console.log('in generate hash ' + err);
        res.status(500).json({msg: 'could not save password'});
      }

      testUser['basic.password'] = hash;
    });

    testUser.save(function(err, user) {
      if(err) {
        return console.log(err);
      }

      user.generateToken(process.env.APP_SECRET, function(err, token) {
        if(err) {
          return console.log(err);
        }

        saveUserToken = token;
      });
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should get a pet document from the collection', function(done) {
    chai.request('localhost:3000')
      .get('/api/pets')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body).to.equal('object');
        expect(res.body[0].name).to.equal('taffy');
        done();
      });
  });

  it('should post a pet document', function(done) {
    chai.request('localhost:3000')
      .post('/api/pets')
      .send({name: 'peanut', owner: 'claudia', weight: 22, type: 'dog' eat: saveUserToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body.owner).to.equal('claudia');
        done();
      });
  });



});