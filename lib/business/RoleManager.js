var Factory = require('entityx').Factory;
var Q = require('q');

/**
 *
 * curl -X POST -H "Content-Type: application/json" -d '{"username":"prova1","password":"password"}' http://localhost:3000/api/v1/user/login
 */
var RoleManager = function() {

  var createNew = function(name, isAdminRole) {
    var deferred = Q.defer();
    var struct = {
      'name': name,
      'isAdminRole': isAdminRole
    };
    Factory.getRepository('User/Role').insert(struct).then(function(doc) {
      var role = Factory.getEntity('User/Role', doc._id, doc);
      return deferred.resolve(role);
    }).catch(function(err) {
      return deferred.reject(err);
    });
    return deferred.promise;
  };

  /**
   * This method searches for the user on the db through the user name
   *
   * @param {string} name
   */
  var loadByName = function(name) {
    var deferred = Q.defer();
    var driver = Factory.getRepository('User/Role');
    driver.loadByName(name).then(
        function(doc) {
          if (doc == null) {
            return deferred.reject(404);
          }
          var model = Factory.getEntity('User/User', doc._id, doc);
          return deferred.resolve(model);
        }).catch(function(err) {
          return deferred.reject(err);
        });
    return deferred.promise;
  };

  countUsersWithRole = function(role, filters) {
    var deferred = Q.defer();
    role.load().then(
        function() {
          var userDriver = Factory.getRepository('User/User');
          return userDriver.countUserWithRole(role.getName(), filters);
        }
    ).then(
        function(count) {
          return deferred.resolve(count);
        }
    ).catch(function(err) {
          return deferred.reject(err);
        });
    return deferred.promise;
  };

  getUsersWithRole = function(role, filters, sort, skip, limit) {
    var deferred = Q.defer();
    role.load().then(
        function() {
          var userDriver = Factory.getRepository('User/User');
          return userDriver.getUserWithRole(
              role.getName(), filters, sort, skip, limit);
        }
    ).then(
        function(docs) {
          var users = [];
          docs.forEach(function(doc) {
            users.push(Factory.getEntity('User/User', doc._id, doc));
          });
          return deferred.resolve(users);
        }
    ).catch(function(err) {
          return deferred.reject(err);
        });
    return deferred.promise;
  };

  countRoles = function(filters) {
    var deferred = Q.defer();
    var roleDriver = Factory.getRepository('User/Role');
    roleDriver.countRoles(filters).then(
        function(count) {
          return deferred.resolve(count);
        }
    ).catch(function(err) {
          return deferred.reject(err);
        });
    return deferred.promise;
  };

  getRoles = function(filters, sort, skip, limit) {
    var deferred = Q.defer();
    var roleDriver = Factory.getRepository('User/Role');
    roleDriver.getRoles(filters, sort, skip, limit).then(
        function(docs) {
          var roles = [];
          docs.forEach(function(doc) {
            roles.push(Factory.getEntity('User/Role', doc._id, doc));
          });
          return deferred.resolve(roles);
        }
    ).catch(function(err) {
          return deferred.reject(err);
        });
    return deferred.promise;
  };

  addRoleToUser = function(role, user) {
    var acl = require('../acl');
    var deferred = Q.defer();
    var userDriver = user._getRepository();
    role.load().then(
        function() {
          return userDriver.addRole(role.getName());
        }
    ).then(
        function() {
          return user.resetRoles(acl);
        }
    ).then(
        function(roles) {
          return deferred.resolve(roles);
        }
    ).catch(function(err) {
          return deferred.reject(err);
        });
    return deferred.promise;
  };

  removeRoleFromUser = function(role, user) {
    var acl = require('../acl');
    var deferred = Q.defer();
    var userDriver = user._getRepository();
    role.load().then(
        function() {
          return userDriver.removeRole(role.getName());
        }
    ).then(
        function() {
          return user.resetRoles(acl);
        }
    ).then(
        function(roles) {
          return deferred.resolve(roles);
        }
    ).catch(function(err) {
          return deferred.reject(err);
        });
    return deferred.promise;
  };

  return {
    loadByName: loadByName,
    createNew: createNew,
    countRoles: countRoles,
    getRoles: getRoles,
    countUsersWithRole: countUsersWithRole,
    getUsersWithRole: getUsersWithRole,
    addRoleToUser: addRoleToUser,
    removeRoleFromUser: removeRoleFromUser
  };
}();
module.exports = RoleManager;
