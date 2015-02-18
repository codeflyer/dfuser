var Q = require('q');
var validator = require('validator');

var ParamParser = function() {
  var _getValue = function(struct, key) {
    var deferred = Q.defer();
    if (key == null || key === '') {
      deferred.reject(new Error(1, 'Key not defined'));
    } else {
      var currentValue;
      var keys = key.split('.');
      for (var idx in keys) {
        if (keys.hasOwnProperty(idx)) {
          var currentKey = keys[idx];
          if (currentValue == null) {
            currentValue = struct[currentKey];
          } else {
            currentValue = currentValue[currentKey];
          }
          if (currentValue === null || typeof currentValue === 'undefined') {
            deferred.reject(new Error(2, 'Key not found'));
          }
        }
      }
      deferred.resolve(currentValue);
    }
    return deferred.promise;
  };

  return {
    parseInt: function(struct, key) {
      var deferred = Q.defer();
      _getValue(struct, key).then(function(result) {
        if (isNaN(parseInt(result))) {
          throw new Error(3, 'Value is not an integer');
        }
        deferred.resolve(parseInt(result));
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    parseString: function(struct, key) {
      var deferred = Q.defer();
      _getValue(struct, key).then(function(result) {
        result = validator.toString(result);
        result = validator.trim(result);
        deferred.resolve(result);
      });
      return deferred.promise;
    }
  };
}();

module.exports = ParamParser;
