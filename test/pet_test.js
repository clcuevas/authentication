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
var saveUserToken = '';

describe('Pet REST API', function() {

  before(function(done) {
    var petTest = new Pet({name: 'taffy', owner: 'homie', weight: 55, type: 'dog'});
    petTest.save(function(err, data) {
      if(err) {
        console.log(err);
        return;
      }

      this.petTest = data;
      console.log(data);
      done();
    }.bind(this));

    var testUser = new User({'username': 'test', 'basic.email': 'test@example.com', 'basic.password': 'foobar123'});

    testUser['basic.password'] = testUser.generateHash(testUser['basic.password'], function(err, hash) {
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
      .send({name: 'peanut', owner: 'claudia', weight: 22, type: 'dog', eat: saveUserToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body.owner).to.equal('claudia');
        done();
      });
  });

  it('should replace existing pet', function(done) {
    var id = this.petTest._id;

    chai.request('localhost:3000')
      .put('/api/pets/' + this.petTest._id)
      .send({name: 'girl', owner: 'tony', weight: 50, type: 'dog', eat: saveUserToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.msg).to.equal('success');
        done();
      });
  });

  it('should delete a pet', function(done) {
    var id = this.petTest._id;

    chai.request('localhost:3000')
      .delete('/api/pets/' + id)
      .send({eat: saveUserToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.msg).to.equal('deleted successfully');
        done();
      });
  });
});

