var passport = require('passport');
var ajaxMessage = require('df-ajax');
var Factory = require('entityx').Factory;

module.exports = function(app) {
  var SessionInfo = require('./entities/values/SessionInfo');
  var userConstant = require('./constant');
  var di = require('./di');

// HELPERS
  var loadRoleHelper = require('./helpers/loadRole');
  var loadRoleByNameHelper = require('./helpers/loadRoleByName');
  var loadUserHelper = require('./helpers/loadUser');
  var checkPrivilegesOnResource = require('./helpers/checkPrivilegesOnResource');

  var LOCAL_CONTROLLER_PATH = './controller/';
// Controllers
  var loginCtrl = require(LOCAL_CONTROLLER_PATH + 'login');
  var logoutCtrl = require(LOCAL_CONTROLLER_PATH + 'logout');
  var logincheckCtrl = require(LOCAL_CONTROLLER_PATH + 'logincheck');
  var createnewCtrl = require(LOCAL_CONTROLLER_PATH + 'createnew');
  var modifyUserCtrl = require(LOCAL_CONTROLLER_PATH + 'modifyUser');
  var modifyUserPasswdCtrl = require(LOCAL_CONTROLLER_PATH + 'modifyPasswd');
  var forgotPasswdCtrl = require(LOCAL_CONTROLLER_PATH + 'forgotPasswd');
  var sendAutoLoginCtrl = require(LOCAL_CONTROLLER_PATH + 'sendAutoLogin');
  var autoLoginTokenCtrl =
      require(LOCAL_CONTROLLER_PATH + 'autoLoginTokenController');

  var roleUserListCtrl =
      require(LOCAL_CONTROLLER_PATH + 'roles/userListController');
  var roleListCtrl = require(LOCAL_CONTROLLER_PATH + 'roles/listController');
  var userListCtrl = require(LOCAL_CONTROLLER_PATH + 'users/listController');
  var userDetailCtrl = require(LOCAL_CONTROLLER_PATH + 'users/userController');
  var roleDetailCtrl = require(LOCAL_CONTROLLER_PATH + 'roles/roleController');
  var roleAddToUserCtrl =
      require(LOCAL_CONTROLLER_PATH + 'roles/addToUserController');
  var roleRemoveFromUserCtrl =
      require(LOCAL_CONTROLLER_PATH + 'roles/removeFromUserController');
  var exportsUserListCtrl =
      require(LOCAL_CONTROLLER_PATH + 'exports/listController');

  passport.use('local-user-password',
      require('./business/passportStrategies/UserPassword')());
  passport.use('local-autologin-token',
      require('./business/passportStrategies/UniqueToken')());
  passport.use('local-confirm-and-login',
      require('./business/passportStrategies/PasswordConfirmAndLogin')());
  passport.use('local-remember-me',
      require('./business/passportStrategies/RememberMePassword')());

  passport.serializeUser(function(user, done) {
    user.load().then(
        function() {
          di.getLogger().info('SERIALIZE');
          di.getLogger().info(user);
          var store = {
            id: user.getId(),
            info: user.getSessionInfo().getArray()
          };
          done(null, JSON.stringify(store));
        }
    );
  });
  passport.deserializeUser(function(storeStruct, done) {
    var id;
    var sessionInfo;
    if (isFinite(storeStruct)) {
      id = storeStruct;
      sessionInfo = new SessionInfo();
    } else {
      var struct = JSON.parse(storeStruct);
      id = struct.id;
      sessionInfo = new SessionInfo(struct.info);
    }
    var user = Factory.getEntity('User/User', id);
    user.setSessionInfo(sessionInfo);
    user.exists().then(
        function(exists) {
          if (exists) {
            user.load().then(
                function(result) {
                  done(null, user);
                },
                function(err) {
                  done(err);
                }
            );
          } else {
            done(null, false);
          }
        },
        function(err) {
          done(err);
        }
    );
  });
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/api/v1/user/login', loginCtrl);
  app.get('/user/logout', isLoggedIn, logoutCtrl);
  app.post('/api/v1/user/logout', isLoggedIn, logoutCtrl);
  app.post('/api/v1/user/logincheck', isLoggedIn, logincheckCtrl);
  app.post('/api/v1/user/createnew', createnewCtrl);
  app.post('/api/v1/user/modifyuser', isLoggedIn, modifyUserCtrl);
  app.post('/api/v1/user/modifypasswd', isLoggedIn, modifyUserPasswdCtrl);
  app.post('/api/v1/user/forgot', forgotPasswdCtrl);
  app.post('/api/v1/user/sentautologin', sendAutoLoginCtrl);
  app.get('/user/autologin/:token', autoLoginTokenCtrl);

  app.post('/api/v1/user/role/users',
      isLoggedIn,
      checkPrivilegesOnResource('roles', ['admin']),
      loadRoleHelper('filters.idRole'),
      ajaxMessage.middleware.paginator,
      roleUserListCtrl);

  app.post('/api/v1/user/user',
      isLoggedIn,
      checkPrivilegesOnResource('users', ['admin']),
      loadUserHelper('idUser'),
      userDetailCtrl);

  app.post('/api/v1/user/userlist',
      isLoggedIn,
      checkPrivilegesOnResource('users', ['admin']),
      ajaxMessage.middleware.paginator,
      userListCtrl);

  app.get('/user/exports/users',
      isLoggedIn,
      checkPrivilegesOnResource('users', ['admin']),
      exportsUserListCtrl);

  app.post('/api/v1/user/rolelist',
      isLoggedIn,
      checkPrivilegesOnResource('roles', ['admin']),
      ajaxMessage.middleware.paginator,
      roleListCtrl);

  app.post('/api/v1/user/role',
      isLoggedIn,
      checkPrivilegesOnResource('roles', ['admin']),
      loadRoleHelper('idRole'),
      roleDetailCtrl);

  app.post('/api/v1/user/role/addtouser',
      isLoggedIn,
      checkPrivilegesOnResource('roles', ['admin']),
      loadUserHelper('idUser'),
      loadRoleHelper('idRole'),
      roleAddToUserCtrl);

  app.post('/api/v1/user/role/removefromuser',
      isLoggedIn,
      checkPrivilegesOnResource('roles', ['admin']),
      loadUserHelper('idUser'),
      loadRoleByNameHelper('roleName'),
      roleRemoveFromUserCtrl);

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.getSessionInfo().getType() !==
          userConstant.SESSION_INFO_TYPE_DEFAULT) {
        return ajaxMessage.sendErrorMessage(res, 403, 'Device type error');
      }
      return next();
    }
    return ajaxMessage.sendErrorMessage(res, 404, 'User not logged');
  }
};
