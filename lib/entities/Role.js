var util = require('util');
var Entity = require('entityx').entities.Entity;

/**
 db.dfcore_roles.save({'_id' : 1, 'name' : 'admin', 'isAdminRole' : true})
 db.dfcore_roles.save({'_id' : 2, 'name' : 'agency', 'isAdminRole' : false})
 db.dfcore_roles.save({'_id' : 3, 'name' : 'shop', 'isAdminRole' : false})
 db.dfcore_roles.save({'_id' : 4, 'name' : 'guest', 'isAdminRole' : false})
 db.sequences.save({'_id' : 'dfcore_roles', 'seq' : 4})
 * @constructor
 */
var Role = function() {
  Entity.call(this, {'useTimestamp': false, 'repositoryName' : 'User/Role'});
};
util.inherits(Role, Entity);

Role.prototype.setName = function(name) {
  this._setData('name', name);
};

Role.prototype.getName = function() {
  return this._getData('name');
};

Role.prototype.setIsAdminRole = function(isActive) {
  this._setData('isAdminRole', isActive);
};

Role.prototype.getIsAdminRole = function() {
  return this._getData('isAdminRole');
};

Role.prototype._loadDetails = function(details) {
  this._setData('name', details.name);
  this._setData('isAdminRole', details.isAdminRole);
};

module.exports = Role;
