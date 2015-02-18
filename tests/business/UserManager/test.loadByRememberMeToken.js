var path = require('path');
var Factory = require('entityx').Factory;
var UserManager = require('../../../lib/business/UserManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: UserManager loadByRememberMeToken', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  var token = 'rememberme998e5271bdb6e1bb79941685ed1b';
  beforeEach(function(done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users.js'), done);
    });
  });

  it('Existent token', function(done) {
    var driver = Factory.getRepository('User/User');
    driver.mongoDbUpdate({_id: 6}, {
          $set: {
            'rememberMeToken.expire': Date.now() + 1000
          }
        }
    ).then(function() {
          return UserManager.loadByRememberMeToken(token);
        }
    ).then(function(user) {
          user.getId().should.be.equal(6);
          done();
        }
    ).catch(function(err) {
          done(err);
        }
    );
  });

  it('Existent token expired', function(done) {
    this.timeout(3000);
    setTimeout(function() {
      UserManager.loadByRememberMeToken(token).then(function(user) {
        (user == null).should.be.true;
        done();
      }).catch(function(err) {
        done(err);
      });
    }, 2010);
  });

  it('get non existent user', function(done) {
    UserManager.loadByRememberMeToken(token + 'abc').then(function(user) {
      (user == null).should.be.true;
      done();
    }).catch(function(err) {
      done(err);
    });
  });
});
