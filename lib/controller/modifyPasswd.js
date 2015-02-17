var crypto = require('crypto');
var async = require('async');
var ajaxMessage = require('df-ajax');
var ErrorX = require('codeflyer-errorx');

var filter = require('../business/filters/ModifyPasswd');
var di = require('../di');

module.exports = function(req, res, next) {
  var config = di.getConfig();
  var fields = req.body.fields;
  var returnMessage = new ajaxMessage.AjaxFormMessage();

  if (typeof fields !== 'object') {
    return ajaxMessage.sendErrorMessage(res, 1001, 'Inconsistent data');
  }

  async.series(
      {
        'sanitize': function(callback) {
          filter.sanitize(fields, callback);
        },
        'validate': function(callback) {
          filter.validate(fields, returnMessage, callback);
        },
        'modify': function(callback) {
          if (returnMessage.hasError()) {
            return callback(ajaxMessage.constants.ERROR_FORM_FIELDS);
          }

          var user = req.user;
          user.load().then(
              function() {
                user.setPassword(
                    crypto
                        .createHash(config.algorithm)
                        .update(fields.password)
                        .digest('hex'));
                user.storeFields(['password']).then(
                    function() {
                      callback(null, user);
                    },
                    function(err) {
                      return callback(new ErrorX(
                          1010, 'User storefields error', err));
                    }
                );
              },
              function(err) {
                return callback(new ErrorX(1010, 'User load error', err));
              }
          );
        }
      },
      function(err) {
        if (err === ajaxMessage.constants.ERROR_FORM_FIELDS) {
          return returnMessage.send(res);
        } else if (err) {
          di.getLogger().error(err.getLogMessage());
          return ajaxMessage.sendErrorMessage(res, err.code, err.message);
        }
        return ajaxMessage.sendValue(res, {});
      }
  );
};
