var ajaxMessage = require('modules/ajax-message');
var di = require('../di');

module.exports = function(resource, privileges) {
  return function(req, res, next) {

    var acl = require('../acl');
    acl.isAllowed(req.user.getId(), resource, privileges).then(
        function(isAllowed) {
          if (isAllowed) {
            return next();
          }
          return ajaxMessage.sendErrorMessage(res, 403, 'Not auth');
        }).catch(function(err) {
          di.getLogger().error('Error on check ACL');
          di.getLogger().error(err);
          return ajaxMessage.sendErrorMessage(res, 500, 'Generic error');
        });
  };
};
