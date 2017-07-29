var path = require('path');
var crypto = require('crypto');
var Factory = require('entityx').Factory;
var RoleManager = require('./../../../lib/business/RoleManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: Create Role', function () {
  before(function (done) {
    require('readyness').doWhen(done);
  });

  beforeEach(function (done) {
    Factory.reset();
    ConnectionStore.getConnection().dropDatabase(function (err) {
      fixtures.load(
          path.join(__dirname, '../..', '/fixtures/users.js'), done);
    });
  });

  it('Create new role', function (done) {
    var roleName = 'custom-name';
    RoleManager.createNew(roleName, true).then(function (newRole) {
          return newRole.load();
        }
    ).then(
        function (newRole) {
          newRole.getId().should.be.equal(11);
          newRole.getName().should.be.equal(roleName);
          newRole.getIsAdminRole().should.be.true;
          done();
        }
    ).catch(function (err) {
      done(err);
    });
  });
});
