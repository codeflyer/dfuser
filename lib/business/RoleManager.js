var Factory = require('entityx').Factory;
var Promise = require('bluebird');

/**
 *
 * curl -X POST -H "Content-Type: application/json" -d '{"username":"prova1","password":"password"}' http://localhost:3000/api/v1/user/login
 */
var RoleManager = function() {

  var createNew = Promise.method(function(name, isAdminRole) {
    var struct = {
      'name': name,
      'isAdminRole': isAdminRole
    };
    return Factory.getRepository('User/Role').insert(struct).then(function(doc) {
      var role = Factory.getEntity('User/Role', doc._id, doc);
      return role;
    }).catch(function(err) {
      throw err;
    });
  });

  /**
   * This method searches for the user on the db through the user name
   *
   * @param {string} name
   */
  var loadByName = Promise.method(function(name) {
    var driver = Factory.getRepository('User/Role');
    return driver.loadByName(name).then(
        function(doc) {
          if (doc == null) {
            throw 404;
          }
          var model = Factory.getEntity('User/User', doc._id, doc);
          return model;
        }).catch(function(err) {
          throw err;
        });
  });

  countUsersWithRole = Promise.method(function(role, filters) {
    return role.load().then(
        function() {
          var userDriver = Factory.getRepository('User/User');
          return userDriver.countUserWithRole(role.getName(), filters);
        }
    ).then(
        function(count) {
          return count;
        }
    ).catch(function(err) {
          throw err;
        });
  });

  var getUsersWithRole = Promise.method(function(role, filters, sort, skip, limit) {
    return role.load().then(
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
          return users;
        }
    ).catch(function(err) {
          throw err;
        });
  });

  var countRoles = Promise.method(function(filters) {
    var roleDriver = Factory.getRepository('User/Role');
    return roleDriver.countRoles(filters).then(
        function(count) {
          return count;
        }
    ).catch(function(err) {
          throw err;
        });
  });

  var getRoles = Promise.method(function(filters, sort, skip, limit) {
    var roleDriver = Factory.getRepository('User/Role');
    return roleDriver.getRoles(filters, sort, skip, limit).then(
        function(docs) {
          var roles = [];
          docs.forEach(function(doc) {
            roles.push(Factory.getEntity('User/Role', doc._id, doc));
          });
          return roles;
        }
    ).catch(function(err) {
          throw err;
        });
  });

  var addRoleToUser = Promise.method(function(role, user) {
    var acl = require('../acl');
    var userDriver = user._getRepository();
    return role.load().then(
        function() {
          return userDriver.addRole(role.getName());
        }
    ).then(
        function() {
          return user.resetRoles(acl);
        }
    ).then(
        function(roles) {
          return roles;
        }
    ).catch(function(err) {
          throw err;
        });
  });

  var removeRoleFromUser = Promise.method(function(role, user) {
    var acl = require('../acl');
    var userDriver = user._getRepository();
    return role.load().then(
        function() {
          return userDriver.removeRole(role.getName());
        }
    ).then(
        function() {
          return user.resetRoles(acl);
        }
    ).then(
        function(roles) {
          return roles;
        }
    ).catch(function(err) {
          throw err;
        });
  });

  return {
    createNew: createNew,
    loadByName: loadByName,
    countRoles: countRoles,
    getRoles: getRoles,
    countUsersWithRole: countUsersWithRole,
    getUsersWithRole: getUsersWithRole,
    addRoleToUser: addRoleToUser,
    removeRoleFromUser: removeRoleFromUser
  };
}();
module.exports = RoleManager;
