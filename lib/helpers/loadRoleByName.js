var middlewareHelpers = require('modules/middleware-helpers');
var ajaxMessage = require('modules/ajax-message');
var RoleManager = require('../business/RoleManager');

module.exports = function(roleParamName) {
  return function(req, res, next) {
    middlewareHelpers.parseString(req.body, roleParamName).then(
        function(roleName) {
          return RoleManager.loadByName(roleName);
        }
    ).then(
        function(role) {
          req.currentRole = role;
          next();
        }
    ).catch(
        function(err) {
          console.log('Error');
          console.log(err);
          if (err.code === 404) {
            return ajaxMessage.sendErrorMessage(res, 404, 'Role not exists');
          }
          return ajaxMessage.sendErrorMessage(res, 422, 'Inconsistent data');
        }
    );
  };
};
