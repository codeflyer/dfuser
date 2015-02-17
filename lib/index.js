/**
 * Initialize module users
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
module.exports = function() {
  var di = require('./di');
  di.setLogger(require('./logger'));
  di.setMailer(require('./defaultMailer'));

  var UserManager = require('./business/UserManager');
  var routes = require('./routes');
  var constant = require('./constant');
  var eventEmitter = require('./eventEmitter');
  var _acl;
  function UserModule() {
    this.eventEmitter = eventEmitter;
    this.__defineGetter__('acl', function() {
      return _acl;
    });
    this.UserManager = UserManager;
    this.routes = routes;
    this.constant = constant;
    this.helpers = {
      loadRole: require('./helpers/loadRole'),
      loadRoleByName: require('./helpers/loadRoleByName'),
      loadUser: require('./helpers/loadUser'),
      paginator: require('./helpers/paginator'),
      checkPrivilegesOnResource: require('./helpers/checkPrivilegesOnResource')
    };
    this.entities = {
      values: {ExpireToken: require('./entities/values/ExpireToken')}
    };
    this.init = function(config) {
      console.log('config');
      console.log(config);
      di.setConfig(config);
      _acl = require('./acl');
      require('./module');
    };
    this.setMailer = function(mailer) {
      di.setMailer(mailer);
    };
    this.getMailer = function() {
      return di.getMailer();
    };
    this.setLogger = function(logger) {
      di.setLogger(logger);
    };
    this.getLogger = function() {
      return di.getLogger();
    };
  }

  return new UserModule();
}();
