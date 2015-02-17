var util = require('util');
var ValueObject = require('entityx').entities.ValueObject;
var constant = require('../../constant');

var SessionInfo = function(details) {
  ValueObject.call(this);
  if (details == null) {
    this._setData('type', constant.SESSION_INFO_TYPE_DEFAULT);
  } else {
    this._setData('type', details.type);
  }
};
util.inherits(SessionInfo, ValueObject);

SessionInfo.prototype.getType = function() {
  return this._getData('type');
};

SessionInfo.prototype.getArray = function() {
  return this._data;
};

module.exports = SessionInfo;
