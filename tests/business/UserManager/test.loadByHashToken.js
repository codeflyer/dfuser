var path = require('path');
var Factory = require('entityx').Factory;
var UserManager = require('../../../lib/business/UserManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: UserManager loadByHashToken', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  var token = 'hash998e5271bdb6e1bb79941685ed1b2';
  var token1 = 'hash998e5271bdb6e1bb79941685ed1b3';
  beforeEach(function(done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users.js'), done);
    });
  });

  it('Existent token as a string', function(done) {
    var driver = Factory.getRepository('User/User');
    driver.mongoDbUpdate({_id: 6}, {
          $set: {
            'hashToken': token
          }
        }
    ).then(function() {
          return UserManager.loadByHashToken(token);
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

  it('Existent token as array', function(done) {
    var driver = Factory.getRepository('User/User');
    driver.mongoDbUpdate({_id: 6}, {
          $set: {
            'hashToken': [token, token1]
          }
        }
    ).then(function() {
          return UserManager.loadByHashToken(token1);
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

  it('get non existent user', function(done) {
    UserManager.loadByHashToken(token + 'abc').then(function(user) {
      (user == null).should.be.true;
      done();
    }).catch(function(err) {
      done(err);
    });
  });
});
