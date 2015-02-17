var UniqueTokenStrategy = require('passport-unique-token').Strategy;
var UserManager = require('../UserManager');
var SessionInfo = require('./../../entities/values/SessionInfo');
var constant = require('../../constant');

/**
 * This method creates the unique token strategy for the user's login (passport module)
 *
 * @returns {UniqueTokenStrategy}
 */
module.exports = function() {
  return new UniqueTokenStrategy(
      {
        tokenParams: 'token',
        passReqToCallback: true
      },
      function(req, token, done) {
        var currentUser;
        UserManager.activeUserByToken(token).then(
            function(user) {
              currentUser = user;
              if (currentUser == null) {
                return done(null, false, {
                  result: 401,
                  message: 'Incorrect username.'
                });
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
              done(null, currentUser);
            }
        ).catch(
            function(err) {
              done(err);
            }
        );
      }
  );
};