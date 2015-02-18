var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var UserManager = require('../UserManager');
var SessionInfo = require('./../../entities/values/SessionInfo');
var constant = require('../../constant');
var di = require('../../di');

/**
 * This method creates the strategy for the user's login (passport module)
 *
 * @returns {LocalStrategy}
 */
module.exports = function() {
  var config = di.getConfig();
  return new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, username, password, done) {
        UserManager.loadByUsername(username).then(function(user) {
              if (!user) {
                throw 1000;
              }

              return user.load();
            }
        ).then(
            function(user) {
              if (crypto
                      .createHash(config.algorithm)
                      .update(password)
                      .digest('hex') !== user.getPassword()) {
                throw 1001;
              }
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
              } else if (err === 1001) {
                return done(null, false, {
                  result: 401,
                  message: 'Incorrect password.'
                });
              }
              return done(err);
            }
        );
      }
  );
};
