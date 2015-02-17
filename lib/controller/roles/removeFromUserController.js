var ajaxMessage = require('df-ajax');
var RoleManager = require('../../business/RoleManager');

module.exports = function(req, res) {
  RoleManager.removeRoleFromUser(req.currentRole, req.currentUser).then(
      function() {
        return ajaxMessage.sendValue(res, {});
      }
  ).catch(function(err) {
        console.log(err.stack);
        return ajaxMessage.sendErrorMessage(res, 500, 'Error not managed');
      });
};
