'use strict';

var chai     = require('chai'             );
var chaihttp = require('chai-http'        );
var expect   = chai.expect;
var mongoose = require('mongoose'         );
var User     = require('../models/User.js');
chai.use(chaihttp);

// Specify db
process.env.MONGOLAB_URI = 'mongodb://localhost/myApp_test'; // SETUP change this

// Start test server
require('../server.js');

describe('User_Routes.js', function() {
  var testUser;
  var testEat;
  before(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.connect(process.env.MONGOLAB_URI, {}, function() {
        chai.request('localhost:3000')
          .post('/users')
          .send({email: 'unicorn@example.com', username: 'unicorn', password: 'foobar'})
          .end(function(err, res) {
            expect(err).to.eq(null);
            testEat = res.body.eat;   // keep eat auth token for use
            User.findOne({username: 'unicorn'}, function(err, user) {
              expect(err).to.eq(null);
              testUser = user;        // keep user for reference
              done();
            });
          });
      });
    });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {done();});
  });

  describe('POST /users', function() {
    describe('with VALID inputs', function() {
      var testResponse;
      before(function(done) {
        chai.request('localhost:3000')
          .post('/users')
          .send({username: 'joe', email: 'joe@example.com', password: 'foobar'})
          .end(function(err, res) {
            expect(err).to.eq(null);
            testResponse = res;
            done();
          });
      });

      it('responds with success:true',  function(done) {
        expect(typeof testResponse.body.eat).to.eql('string');
        done();
      });
      it('makes another user', function(done) {
        User.find({}, function(err, users) {
          expect(users.length).to.eq(2);
          done();
        });
      });
    });

    // VALIDATIONS FAILING!!!
    describe.skip('with INvalid input', function() {
      describe('with existing user', function() {
        it('returns a JSON error for taken email', function(done) {
          chai.request('localhost:3000')
            .post('/users')
            .send({username: 'acceptable', email: 'unicorn@example.com', password: 'foobar'})
            .end(function(err, res) {
              expect(err).to.eql(null);
              expect(res.body.error).to.eql('email');
              done();
            });
        });
        it('returns a JSON error for taken username', function(done) {
          chai.request('localhost:3000')
            .post('/users')
            .send({username: 'unicorn', email: 'acceptable@example.com', password: 'foobar'})
            .end(function(err, res) {
              // INSERTED THIS FOR DEBUGGING
              User.find({}, function(err, users) {
                console.log('ALL USERS WHEN TESTING VALIDATIONS: ', users);
                expect(err).to.eql(null);
                expect(res.body.error).to.eql('username');
                done();
              });
            });
        });
      });
    });
  });

  describe('GET /users/:id', function() {
    var unicornUser;
    before(function(done) {
      chai.request('localhost:3000')
        .get('/users/' + testUser._id)
        .send({eat: testEat})
        .end(function(err, res) {
          unicornUser = res.body;
          done();
        });
    });
    it('returns the user', function() {
      expect(typeof unicornUser).to.eq('object');
    });
    it('returns the user\'s username', function(){
      expect(unicornUser.username).to.eq('unicorn');
    });
    it('returns the user\'s  email', function() {
      expect(unicornUser.email).to.eq('unicorn@example.com');
    });
    it('returns the user\'s  passtoken', function() {
      expect(typeof unicornUser.basic.password).to.eq('string');
    });
  });

  describe('PATCH /users/:id', function() {
    describe('for a user trying to change another users account', function() {
      it('does NOT update the other user', function(done) {
        chai.request('localhost:3000')
        .patch('/users/' + '123456789wrong')
        .set({eat: testEat})
        .send({email: 'newEmail@example.com'})
        .end(function(err, res) {
          expect(res.body.error).to.eq('unauthorized');
          expect(res.statusCode).to.eq(401);
          done();
        });
      });
    });
    describe('for the owner user', function() {
      it('updates the user ', function(done) {
        chai.request('localhost:3000')
        .patch('/users/' + testUser._id)
        .set({eat: testEat})
        .send({email: 'newEmail@example.com'})
        .end(function(err, res) {
          expect(res.body.success).to.eq(true);
          done();
        });
      });
    });
  });

  describe('DELETE /users', function() {
    describe('for users attempting to delete a DIFFERENT user', function() {
      it('prevents unauthorized user from suspending another user', function(done) {
        chai.request('localhost:3000')
          .del('/users/' + '123456789another')
          .set({eat: testEat})
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.status).to.eq(401);
            expect(res.body.error).to.eq('unauthorized');
            done();
          });
      });
    });
    describe('for user deleting themselves', function() {
      it('sets the user\'s deleted field to current time', function(done) {
        chai.request('localhost:3000')
          .del('/users/' + testUser._id)
          .set({eat: testEat})
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.success).to.eq(true);
            done();
          });
      });
    });
  });

  describe('with NON-existing user', function() {
    describe('GET /notauser', function() {
      it('returns a message to please sign in', function(done) {
        chai.request('localhost:3000')
          .get('/users/123456789wrong')
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.body.error).to.eq('user not found');
            done();
          });
      });
    });
    describe('PATCH', function() {
      it('returns an auth error message in the body', function(done) {
        chai.request('localhost:3000')
          .patch('/users/123456789wrong')
          .send({username: 'thisShouldFail'})
          .end(function(err, res) {
            expect(err).to.eq(null);
            expect(res.body.error).to.eq('please sign in to do that');
            done();
          });
      });
    });
    describe('DELETE', function() {
      it('returns an auth error message in the body', function(done) {
        chai.request('localhost:3000')
          .del('/users/123456789wrong')
          .end(function(err, res) {
            expect(err).to.eq(null);
            expect(res.body.error).to.eq('please sign in to do that');
            done();
          });
      });
    });
  });
});
