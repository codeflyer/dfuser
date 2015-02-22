var util = require('util');
var Promise = require('bluebird');
var Entity = require('entityx').entities.Entity;
var PubSub = require('pub-sub-then');
var UserManager = require('../business/UserManager');

var User = function() {
  Entity.call(this, {'useTimestamp': true, 'repositoryName': 'User/User'});
  this._sessionInfo = null;
};
util.inherits(User, Entity);

User.prototype.setUsername = function(username) {
  this._setData('username', username);
};

User.prototype.getUsername = function() {
  return this._getData('username');
};

User.prototype.setPassword = function(password) {
  this._setData('password', password);
};

User.prototype.getPassword = function() {
  return this._getData('password');
};

User.prototype.setEmail = function(email) {
  this._setData('email', email);
};

User.prototype.getEmail = function() {
  return this._getData('email');
};

User.prototype.setName = function(name) {
  this._setData('name', name);
};

User.prototype.getName = function() {
  return this._getData('name');
};

User.prototype.setSurname = function(surname) {
  this._setData('surname', surname);
};

User.prototype.getSurname = function() {
  return this._getData('surname');
};

User.prototype.setLocale = function(locale) {
  this._setData('locale', locale);
};

User.prototype.getLocale = function() {
  return this._getData('locale');
};

User.prototype.setResetPasswordToken = function(resetPasswordToken) {
  this._setData('resetPasswordToken', resetPasswordToken);
};

User.prototype.getResetPasswordToken = function() {
  return this._getData('resetPasswordToken');
};

User.prototype.setConfirmationToken = function(confirmationToken) {
  this._setData('confirmationToken', confirmationToken);
};

User.prototype.getConfirmationToken = function() {
  return this._getData('confirmationToken');
};

User.prototype.setAutoLoginToken = function(autoLoginToken) {
  this._setData('autoLoginToken', autoLoginToken);
};

User.prototype.getAutoLoginToken = function() {
  return this._getData('autoLoginToken');
};

User.prototype.setRememberMeToken = function(rememberMeToken) {
  this._setData('rememberMeToken', rememberMeToken);
};

User.prototype.getRememberMeToken = function() {
  return this._getData('rememberMeToken');
};

User.prototype.setLastLogin = function(lastLogin) {
  this._setData('lastLogin', lastLogin);
};

User.prototype.getLastLogin = function() {
  return this._getData('lastLogin');
};

User.prototype.setIsActive = function(isActive) {
  this._setData('isActive', isActive);
};

User.prototype.getIsActive = function() {
  return this._getData('isActive');
};

User.prototype.setIsDisabled = function(isDisabled) {
  this._setData('isDisabled', isDisabled);
};

User.prototype.getIsDisabled = function() {
  return this._getData('isDisabled');
};

User.prototype.setIsAdmin = function(isAdmin) {
  this._setData('isAdmin', isAdmin);
};

User.prototype.getIsAdmin = function() {
  return this._getData('isAdmin');
};

/**
 * Get the role list of a user.
 * @return {*}
 */
User.prototype.getPredefinedRoles = function() {
  return this._getData('roles');
};

/**
 * Get the role list of a user.
 * @return {*}
 */
User.prototype.getRoles = function() {
  var retArray = this._getData('roles').slice(0);
  retArray.push(UserManager.getRelatedUserRole(this));
  return retArray;
};

/**
 * Check if the user has a role
 * @return {boolean}
 */
User.prototype.hasRole = function(role) {
  return this.getRoles().indexOf(role) !== -1;
};

User.prototype.resetRoles = function(acl) {

  return new Promise(function(resolve, reject) {
    if (!this.isLoad()) {
      reject('User not initialized');
      return;
    }

    var that = this;
    acl.userRoles(that.getId(), function(err, roles) {
      acl.removeUserRoles(that.getId(), roles, function(err) {
        if (err) {
          return reject(err);
        } else {
          acl.addUserRoles(that.getId(), that.getRoles(), function(err) {
            if (err) {
              return reject(err);
            }
            resolve(that.getRoles());
          });
        }
      });
    });
  });
};

User.prototype._loadDetails = function(details) {
  this._setData('username', details.username);
  this._setData('password', details.password);
  this._setData('email', details.email);
  this._setData('name', details.name || '');
  this._setData('surname', details.surname || '');
  this._setData('locale', details.locale);

  this._setData('confirmationToken',
      this.getLoaderHelper().loadValueObject('User/ExpireToken',
          details.confirmationToken || {token: '', expire: null}, true));
  this._setData('resetPasswordToken',
      this.getLoaderHelper().loadValueObject('User/ExpireToken',
          details.resetPasswordToken || {token: '', expire: null}, true));
  this._setData('autoLoginToken',
      this.getLoaderHelper().loadValueObject('User/ExpireToken',
          details.autoLoginToken || {token: '', expire: null}, true));
  this._setData('rememberMeToken',
      this.getLoaderHelper().loadValueObject('User/ExpireToken',
          details.rememberMeToken || {token: '', expire: null}, true));

  this._setData('lastLogin', details.lastLogin);
  this._setData('isActive', details.isActive);
  this._setData('isDisabled', details.isDisabled);
  this._setData('isAdmin', details.isAdmin);
  if (details.roles == null || details.roles.length === 0) {
    this._setData('roles', []);
  } else {
    var tmpRoles = [];
    details.roles.forEach(function(role) {
      tmpRoles.push(role);
    });
    this._setData('roles', tmpRoles);
  }
};

/**
 * Verify if the instance is the instance currently used for the session (the instance setted in the request.user field)
 * @returns {boolean}
 */
User.prototype.isSessionInstance = function() {
  return this._sessionInfo != null;
};

/**
 * Get information about the session
 * @returns {null|*}
 */
User.prototype.getSessionInfo = function() {
  return this._sessionInfo;
};

/**
 * Set information about the session
 */
User.prototype.setSessionInfo = function(sessionInfo) {
  this._sessionInfo = sessionInfo;
};

/**
 * Delete user permanently
 */
User.prototype.permanentDelete = Promise.method(function() {
  var that = this;
  return PubSub.publish('user:beforeUserRemove', that, true).then(
      function() {
        return that.delete(true);
      }
  ).then(
      function() {
        return PubSub.publish('user:afterUserRemove', that, true);
      }
  ).then(
      function() {
        return;
      }
  ).fail(
      function(err) {
        throw err;
      }
  );
});

/**
 * Returns details of the user for the info about of the user
 *
 * @returns {{username: *, email: *, name: *, surname: *}}
 */
User.prototype.getLoggedAccountArray = function() {
  if (!this.isLoad()) {
    throw 'User not initialized';
  }
  return {
    username: this.getUsername(),
    email: this.getEmail(),
    name: this.getName(),
    surname: this.getSurname()
  };
};

module.exports = User;
