var ajaxMessage = require('df-ajax');

module.exports = function(req, res) {
  req.logout();
  return ajaxMessage.sendValue(res, 0);
};
