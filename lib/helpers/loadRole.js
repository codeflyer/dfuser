var middlewareHelpers = require('modules/middleware-helpers');
var ajaxMessage = require('modules/ajax-message');
var Factory = require('entityx').Factory;

module.exports = function(roleParamName) {
  return function(req, res, next) {
    middlewareHelpers.parseInt(req.body, roleParamName).then(
        function(idRole) {
          return Factory.getEntity('User/Role', idRole).load();
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
