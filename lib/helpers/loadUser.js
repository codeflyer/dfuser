var middlewareHelpers = require('modules/middleware-helpers');
var ajaxMessage = require('modules/ajax-message');
var Factory = require('entityx').Factory;

module.exports = function(userParamName, failOnNotFound) {
  if (failOnNotFound !== false) {
    failOnNotFound = true;
  }

  return function(req, res, next) {
    middlewareHelpers.parseInt(req.body, userParamName).then(
        function(idUser) {
          return Factory.getEntity('User/User', idUser).load();
        }
    ).then(
        function(user) {
          req.currentUser = user;
          next();
        }
    ).catch(
        function(err) {
          console.log('Error');
          console.log(err);
          if (err.code === 404) {
            if (failOnNotFound) {
              return ajaxMessage.sendErrorMessage(res, 404, 'User not exists');
            } else {
              return next();
            }
          }
          return ajaxMessage.sendErrorMessage(res, 422, 'Inconsistent data');
        }
    );
  };
};
