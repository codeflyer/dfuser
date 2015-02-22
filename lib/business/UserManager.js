var crypto = require('crypto');
var Factory = require('entityx').Factory;
var Promise = require('bluebird');
var di = require('../di');

/**
 *
 * curl -X POST -H "Content-Type: application/json" -d '{"username":"prova1","password":"password"}' http://localhost:3000/api/v1/user/login
 */
var UserManager = function() {
  /**
   * This method create new user and return it
   *
   * @param {String} username
   * @param {String} password
   * @param {String} email
   * @param {String} name
   * @param {String} surname
   * @param {String} locale
   * @param {*} next
   */
  var createNewUser = Promise.method(
      function(username, password, email, name, surname, locale) {
        username = username.toLowerCase();
        email = email.toLowerCase();
        di.getLogger().info('Inizio creazione utente');
        var config = di.getConfig();
        var struct = {
          'username': username,
          'password': crypto
              .createHash(config.algorithm)
              .update(password)
              .digest('hex'),
          'email': email,
          'name': name,
          'surname': surname,
          'locale': locale,
          'lastLogin': null,
          'isAdmin': false,
          'isActive': false,
          'isDisabled': false,
          'confirmationToken': {
            'token': crypto.randomBytes(
                config.randomBytesConfirmationToken).toString('hex'),
            'expire': Date.now() + config.expiresConfirmationToken
          },
          'resetPasswordToken': {'token': '', 'expire': ''},
          'autoLoginToken': {'token': '', 'expire': ''},
          'rememberMeToken': {'token': '', 'expire': ''}
        };
        return Factory.getRepository('User/User').insert(struct).then(function(doc) {
          var user = Factory.getEntity('User/User', doc._id, doc);
          di.getLogger().info('Utente creato: ' + doc._id);
          di.getLogger().error('Utente creato: ' + doc._id);
          return user;
        }).catch(function(err) {
          throw err;
        });
      }
  );

  /**
   * This method searches for the user on the db through the user name
   *
   * @param {String} userName
   * @param {*} next
   */
  var loadByUsername = Promise.method(function(userName) {
    userName = userName.toLowerCase();
    var driver = Factory.getRepository('User/User');
    return driver.loadByUsername(userName).then(function(doc) {
      if (doc == null) {
        return;
      }
      return Factory.getEntity('User/User', doc._id, doc);
    }).catch(function(err) {
      throw err;
    });
  });

  /**
   * This method searches for the user on the db through the unique token login
   *
   * @param {String} token
   * @param {*} next
   */
  var loadByAutoLoginToken = Promise.method(function(token) {
    var driver = Factory.getRepository('User/User');
    return driver.loadByAutoLoginToken(token).then(function(doc) {
      if (doc == null) {
        return;
      }
      return Factory.getEntity('User/User', doc._id);
    }).catch(function(err) {
      throw err;
    });
  });

  /**
   * This method search user by confirmation token and active it
   *
   * @param {String} token
   * @param {*} next
   */
  var activeUserByToken = Promise.method(function(token) {
    var driver = Factory.getRepository('User/User');
    return driver.activateUserByToken(token).then(function(doc) {
          if (doc == null) {
            return;
          }
          return Factory.getEntity('User/User', doc._id);
        }
    ).catch(function(err) {
          throw err;
        }
    );
  });

  /**
   * This method searches for the user on the db through the remember me token
   *
   * @param {String} token
   * @param {*} next
   */
  var loadByRememberMeToken = Promise.method(function(token) {
    var driver = Factory.getRepository('User/User');
    return driver.loadByRememberMeToken(token).then(function(doc) {
          if (doc == null) {
            return;
          }
          return Factory.getEntity('User/User', doc._id, doc);
        }
    ).catch(function(err) {
          throw err;
        }
    );
  });

  var getRelatedUserRole = function(user) {
    return 'USER-ROLE-' + user.getId();
  };

  var countUsers = Promise.method(function(filters) {
    var userDriver = Factory.getRepository('User/User');
    return userDriver.countUsers(filters).then(
        function(count) {
          return count;
        }
    ).catch(function(err) {
          throw err;
        });
  });

  var getUsers = Promise.method(function(filters, sort, skip, limit) {
    var userDriver = Factory.getRepository('User/User');
    return userDriver.getUsers(filters, sort, skip, limit).then(
        function(docs) {
          var users = [];
          docs.forEach(function(doc) {
            users.push(Factory.getEntity('User/User', doc._id, doc));
          });
          return users;
        }
    ).catch(function(err) {
          throw err;
        }
    );
  });

  return {
    getRelatedUserRole: getRelatedUserRole,
    createNewUser: createNewUser,
    loadByUsername: loadByUsername,
    loadByAutoLoginToken: loadByAutoLoginToken,
    loadByRememberMeToken: loadByRememberMeToken,
    activeUserByToken: activeUserByToken,
    countUsers: countUsers,
    getUsers: getUsers
  };
}();
module.exports = UserManager;
