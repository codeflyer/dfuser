var ajaxMessage = require('df-ajax');

module.exports = function(req, res) {
  req.currentUser.load().then(
      function() {
        var values = req.currentUser.getLoggedAccountArray();
        values.id = req.currentUser.getId();
        values.roles = req.currentUser.getPredefinedRoles();
        return ajaxMessage.sendValue(res, values);
      }
  ).catch(function(err) {
        console.log(err.stack);
        return ajaxMessage.sendErrorMessage(res, 500, 'Error not managed');
      });
};
