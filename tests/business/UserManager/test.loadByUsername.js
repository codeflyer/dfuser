var path = require('path');
var Factory = require('entityx').Factory;
var UserManager = require('../../../lib/business/UserManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: UserManager loadByUsername', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function(done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function(err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users.js'), done);
    });
  });

  it('Get one user', function(done) {
    UserManager.loadByUsername('test@test.com').then(function(user) {
      user.getId().should.be.equal(1);
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('Get second user', function(done) {
    UserManager.loadByUsername('test2@test.com').then(function(user) {
      user.getId().should.be.equal(2);
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('Get non existent user', function(done) {
    UserManager.loadByUsername('no@test.com').then(function(user) {
      (user == null).should.be.true;
      done();
    }).catch(function(err) {
      done(err);
    });
  });
});
