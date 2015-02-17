var ajaxMessage = require('df-ajax');

var acl = require('./../acl');
var di = require('../di');

module.exports = function(req, res) {
  var user = req.user;
  user.load().then(
      function() {
        return user.resetRoles(acl);
      }).then(
      function(roles) {
        var values = user.getLoggedAccountArray();
        values.roles = roles;
        PubSubThen.publish('user:prepareLoginData', user, values).then(
            function() {
              return ajaxMessage.sendValue(res, values);
            }
        ).fail(
            function(err) {
              di.getLogger().error(err);
              return ajaxMessage.sendErrorMessage(
                  res, 1100, 'Error in publish pubsub login');
            }
        );
      })
      .catch(
      function(err) {
        di.getLogger().error(err);
        return ajaxMessage.sendErrorMessage(res, 1010, 'User load error');
      });
};
