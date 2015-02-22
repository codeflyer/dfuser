var Promise = require('bluebird');
var validator = require('validator');

var ParamParser = function() {
  var _getValue = function(struct, key) {
    return new Promise(function(resolve, reject) {
      if (key == null || key === '') {
        reject(new Error(1, 'Key not defined'));
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
              reject(new Error(2, 'Key not found'));
              return;
            }
          }
        }
        resolve(currentValue);
      }
    });
  };

  return {
    parseInt: Promise.method(function(struct, key) {
      return _getValue(struct, key).then(function(result) {
        if (isNaN(parseInt(result))) {
          throw new Error(3, 'Value is not an integer');
        }
        return parseInt(result);
      }).catch(function(err) {
        throw err;
      });

    }),
    parseString: Promise.method(function(struct, key) {
      return _getValue(struct, key).then(function(result) {
        result = validator.toString(result);
        result = validator.trim(result);
        return result;
      });
    })
  };
}();

module.exports = ParamParser;
