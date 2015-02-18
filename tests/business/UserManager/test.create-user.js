var path = require('path');
var crypto = require('crypto');
var Factory = require('entityx').Factory;
var UserManager = require('./../../../lib/index').UserManager;
var eventEmitter = require('./../../../lib/index').eventEmitter;

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: Create User', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  var logEvent = null;

  var logFunc = function(message) {
    console.log(message);
  };

  beforeEach(function(done) {
    Factory.reset();
    logEvent = eventEmitter.on('user:logger:info', logFunc);
    logEvent = eventEmitter.on('user:logger:error', logFunc);
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users-empty.js'), done);
    });
  });

  afterEach(function(done) {
    logEvent = eventEmitter.removeListener('user:logger:info', logFunc);
    logEvent = eventEmitter.removeListener('user:logger:error', logFunc);
    done();
  });

  it('Create new customer', function(done) {
    var username = 'test@test.com';
    var email = 'test@test.com';
    var password = 'password';
    var name = 'davide';
    var surname = 'fiorello';
    var locale = 'it_IT';

    UserManager.createNewUser(
        username, password, email, name,
        surname, locale).then(function(newUser) {
          return newUser.load();
        }
    ).then(
        function(newUser) {
          newUser.getId().should.equal(1);
          newUser.getUsername().should.equal(username);
          newUser.getPassword().should.equal(
              crypto.createHash('md5')
                  .update(password)
                  .digest('hex'));
          done();

        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Create two user', function(done) {
    var username = 'test@test.com';
    var email = 'test@test.com';
    var password = 'password';
    var name = 'davide';
    var surname = 'fiorello';
    var locale = 'it_IT';

    UserManager.createNewUser(
        username, password, email, name,
        surname, locale).then(function(newUser) {
          return newUser.load();
        }
    ).then(
        function(newUser) {
          newUser.getId().should.equal(1);
          newUser.getUsername().should.equal(username);
          newUser.getPassword().should.equal(
              crypto.createHash('md5')
                  .update(password)
                  .digest('hex'));

          return UserManager.createNewUser(
              'test2@test.com',
              'password2',
              'test2@test.com',
              'gino',
              'bianchi',
              'en_EN');
        }
    ).then(function(secondUser) {
          return secondUser.load();
        }
    ).then(function(secondUser) {
          secondUser.getId().should.equal(2);
          secondUser.getUsername().should.equal('test2@test.com');
          secondUser.getPassword().should.equal(
              crypto.createHash('md5').update('password2').digest('hex'));
          done();
        }
    ).catch(function(err) {
          done(err);
        }
    );
  });
});
