var path = require('path');
var Factory = require('entityx').Factory;
var UserManager = require('../../../lib/business/UserManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: UserManager activeUserByToken', function() {
  before(function(done) {
    require('readyness').doWhen(done);
  });

  var token = 'd3c18e6d8998e5271bdb6e1bb79941685ed1bcfd4be1d44bdda68240b';
  beforeEach(function(done) {
    Factory.reset();
    fixtures.clear(function(err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users.js'), done);
    });
  });

  it('First activation', function(done) {
    UserManager.activeUserByToken(token).then(function(user) {
      user.getId().should.be.equal(3);
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('Second activation', function(done) {
    UserManager.activeUserByToken(token).then(function(user) {
      user.getId().should.be.equal(3);
      return UserManager.activeUserByToken(token);
    }).then(function(user) {
      (user == null).should.be.true;
      done();
    }).catch(function(err) {
      done(err);
    });
  });
});
