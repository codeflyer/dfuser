var util = require('util');
var MongoDBDriver = require('entityx').repositories.MongoDBSequence;

var RoleDriver = function(id) {
  MongoDBDriver.call(this, {
    'useTimestamp': false,
    'collectionName': 'dfcore_roles'
  }, id);
};
util.inherits(RoleDriver, MongoDBDriver);

/**
 * @param {String} name
 */
RoleDriver.prototype.loadByName = function(name) {
  return this.loadOneBy({'name': name});
};

RoleDriver.prototype.countRoles = function(filters) {
  var query = {};
  this._addFilters(filters, query);
  return this.mongoDbCount(query);
};

RoleDriver.prototype.getRoles = function(filters, sort, skip, limit) {
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

RoleDriver.prototype._addFilters = function(filters, query) {
  try {
    if (filters.name != null && filters.name.length > 0) {
      query.name = {$regex: filters.name, $options: 'i'};
    }

    if (filters.isAdmin != null) {
      if (filters.isAdmin === 2) {
        query.isAdminRole = true;
      } else if (filters.isAdmin === 3) {
        query.isAdminRole = false;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = RoleDriver;
