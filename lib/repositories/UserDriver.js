var defineUserStruct = require('../structs/user.json');
var Builder = require('entityx').Builder;
var UserDriver = Builder.buildRepository(defineUserStruct);
var Promise = require('bluebird');

/**
 * This method searches for the user on the db through the user name
 *
 * @param {String} userName
 */
UserDriver.prototype.loadByUsername = function(userName) {
  return this.loadOneBy({'username': userName});
};

/**
 * This method searches for the user on the db through the unique token login
 *
 * @param {String} token
 */
UserDriver.prototype.loadByAutoLoginToken = function(token) {
  return this.loadOneBy({
    'autoLoginToken.token': token,
    'autoLoginToken.expire': {$gt: Date.now()}
  });
};

/**
 * This method searches for the user on the db through the remember me token
 *
 * @param {String} token
 * @param {*} next
 */
UserDriver.prototype.loadByRememberMeToken = function(token) {
  return this.loadOneBy({
    'rememberMeToken.token': token,
    'rememberMeToken.expire': {$gt: Date.now()}
  });
};

UserDriver.prototype.countUserWithRole = function(roleName) {
  return this.mongoDbCount({
    'roles': roleName
  });
};

UserDriver.prototype.getUserWithRole =
    function(roleName, filters, sort, skip, limit) {
      var query = {
        'roles': roleName
      };
      if (sort == null) {
        sort = {'username': 1};
      }
      var options = {
        'limit': limit,
        'skip': skip,
        'sort': sort
      };

      return this.mongoDbFindToArray(query, {}, options);
    };

UserDriver.prototype.countUsers = function(filters) {
  var query = {};
  this._addFilters(filters, query);
  return this.mongoDbCount(query);
};

UserDriver.prototype.getUsers = function(filters, sort, skip, limit) {
  var query = {};
  this._addFilters(filters, query);

  if (sort == null) {
    sort = {'username': 1};
  }
  var options = {
    'limit': limit,
    'skip': skip,
    'sort': sort
  };
  return this.mongoDbFindToArray(query, {}, options);
};

/**
 * Activate the user by a token
 *
 * @param {string} token
 */
UserDriver.prototype.activateUserByToken = Promise.method(function(token) {
  return this.mongoDbFindAndModify(
      {'confirmationToken.token': token},
      [],
      {
        '$set': {
          isActive: true,
          '_ts.modified': new Date(),
          'confirmationToken.token': '',
          'confirmationToken.expire': ''
        }
      },
      {new: true}
  ).then(function(doc) {
        return doc.value;
      }
  ).catch(function(err) {
        throw err;
      }
  );
});

/**
 * @param {String} roleName
 */
UserDriver.prototype.addRole = function(roleName) {
  return this.mongoDbUpdate(
      {'_id': this._id}, {'$addToSet': {'roles': roleName}});
};

/**
 * @param {String} roleName
 */
UserDriver.prototype.removeRole = function(roleName) {
  return this.mongoDbUpdate(
      {'_id': this._id}, {'$pull': {'roles': roleName}});
};

UserDriver.prototype._addFilters = function(filters, query) {
  try {
    if (filters.username != null && filters.username.length > 0) {
      query.username = {$regex: filters.username, $options: 'i'};
    }

    if (filters.name != null && filters.name.length > 0) {
      query.name = {$regex: filters.name, $options: 'i'};
    }

    if (filters.surname != null && filters.surname.length > 0) {
      query.surname = {$regex: filters.surname, $options: 'i'};
    }

    if (filters.email != null && filters.email.length > 0) {
      query.email = {$regex: filters.email, $options: 'i'};
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = UserDriver;
