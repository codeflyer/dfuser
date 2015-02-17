var ajaxMessage = require('df-ajax');

module.exports = function(req, res) {
  req.currentRole.load().then(
      function() {
        return ajaxMessage.sendValue(res, {
          'id': req.currentRole.getId(),
          'name': req.currentRole.getName(),
          'isAdminRole': req.currentRole.getIsAdminRole()
        });
      }
  ).catch(function(err) {
        console.log(err.stack);
        return ajaxMessage.sendErrorMessage(res, 500, 'Error not managed');
      });
};
