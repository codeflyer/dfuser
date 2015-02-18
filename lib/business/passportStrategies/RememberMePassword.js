var UserManager = require('../UserManager');
var SessionInfo = require('./../../entities/values/SessionInfo');
var constant = require('../../constant');
var ExpireToken = require('../../entities/values/ExpireToken');
var RememberMeStrategy = require('passport-remember-me-pro').Strategy;
var di = require('../../di');

/**
 * This method creates the strategy for the user's login remember me (passport module)
 *
 * @returns {RememberMeStrategy}
 */
module.exports = function() {
  var config = di.getConfig();
  return new RememberMeStrategy(
      {
        'key': 'rememberMe',
        'passReqToCallback': true,
        'cookie': {'maxAge': config.expireRememberMeToken || 3600}
      },
      function(req, token, done) {
        UserManager.loadByRememberMeToken(token).then(
            function(user) {
              if (!user) {
                throw 1000;
              }
              return user.load();
            }
        ).then(
            function(user) {
              var type;
              if (req._dfcoreUser == null || req._dfcoreUser.type == null) {
                type = constant.SESSION_INFO_TYPE_DEFAULT;
              } else {
                type = req._dfcoreUser.type;
              }
              user.setSessionInfo(new SessionInfo({
                type: type
              }));
              done(null, user);
            }
        ).catch(function(err) {
              if (err === 1000) {
                return done(null, false, {
                  result: 401,
                  message: 'Incorrect username.'
                });
              }
              return done(err);
            }
        );
      },
      function(req, user, done) {
        var rememberMeToken = new ExpireToken(
            {
              'token': crypto.randomBytes(
                  config.randomBytesAutoLoginToken).toString('hex'),
              'expire': Date.now() + (config.expireRememberMeToken || 3600)
            });
        user.setRememberMeToken(rememberMeToken);
        user.storeFields(['rememberMeToken']).then(
            function() {
              return user.load();
            }
        ).then(
            function() {
              done(null, user);
            }
        ).catch(
            function(err) {
              done(err);
            }
        );
      }
  );
};
