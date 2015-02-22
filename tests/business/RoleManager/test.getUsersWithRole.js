var path = require('path');
var crypto = require('crypto');
var Factory = require('entityx').Factory;
var RoleManager = require('./../../../lib/business/RoleManager');

var ConnectionStore = require('connection-store');
var fixtures = ConnectionStore.getConnection('fixtures');

describe('user: RoleManager getUsersWithRole', function() {
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

  it('Count admin roles', function(done) {
    RoleManager.getUsersWithRole(Factory.getEntity('User/Role', 1)).then(function(userList) {
          var users = userList.map(function(user) {
            return user.getId();
          });
          users.sort().should.be.eql([1, 4]);
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Count guest roles', function(done) {
    RoleManager.getUsersWithRole(Factory.getEntity('User/Role', 3)).then(function(userList) {
          var users = userList.map(function(user) {
            return user.getId();
          });
          users.sort().should.be.eql([1, 2, 4]);
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });

  it('Count publisher roles', function(done) {
    RoleManager.getUsersWithRole(Factory.getEntity('User/Role', 2)).then(function(userList) {
          var users = userList.map(function(user) {
            return user.getId();
          });
          users.sort().should.be.eql([2]);
          done();
        }
    ).catch(function(err) {
          done(err);
        });
  });
});
