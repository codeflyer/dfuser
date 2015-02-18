var path = require('path');
var Factory = require('entityx').Factory;
var UserManager = require('../../../lib/business/UserManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: UserManager loadByAutoLoginToken', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  var token = 'abcde6d8998e5271bdb6e1bb79941685ed1bcfd4be1d44bdda68240b';
  beforeEach(function(done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users.js'), function() {
            done();
          });
    });
  });

  it('Existent token', function(done) {
    var driver = Factory.getRepository('User/User');
    driver.mongoDbUpdate({_id : 2}, {
          $set: {
            'autoLoginToken.expire': Date.now() + 1000
          }
        }
    ).then(function() {
          return UserManager.loadByAutoLoginToken(token);
        }
    ).then(function(user) {
          (user != null).should.be.true;
          user.getId().should.be.equal(2);
          done();
        }
    ).catch(function(err) {
          done(err);
        }
    );
  });

  it('Existent token expired', function(done) {
    setTimeout(function() {
      UserManager.loadByAutoLoginToken(token).then(function(user) {
        (user == null).should.be.true;
        done();
      }).catch(function(err) {
        done(err);
      });
    }, 1010);
  });

  it('get non existent user', function(done) {
    UserManager.loadByAutoLoginToken(token + 'abc').then(function(user) {
      (user == null).should.be.true;
      done();
    }).catch(function(err) {
      done(err);
    });
  });
});
