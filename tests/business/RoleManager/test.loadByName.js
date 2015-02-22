var path = require('path');
var crypto = require('crypto');
var Factory = require('entityx').Factory;
var RoleManager = require('./../../../lib/business/RoleManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: RoleManager loadByName', function() {
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

  it('Load admin role', function(done) {
    RoleManager.loadByName('admin').then(function(role) {
          role.getId().should.be.equal(1);
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Load non existent role', function(done) {
    RoleManager.loadByName('non-exist', true).then(function(role) {
          done('should be trown an error');
        }
    ).catch(function(err) {
          err.should.be.equal(404);
          done();
        });
  });
});
