var _config = {};
var _logger = null;
var _mailer = null;

module.exports = {
  getConfig: function() {
    return _config;
  },
  setConfig: function(config) {
    _config = config;
  },
  getLogger: function() {
    return _logger;
  },
  setLogger: function(logger) {
    _logger = logger;
  },
  getMailer: function() {
    return _mailer;
  },
  setMailer: function(mailer) {
    _mailer = mailer;
  }
};
