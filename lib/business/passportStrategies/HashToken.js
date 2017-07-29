var UniqueTokenStrategy = require('passport-unique-token').Strategy;
var UserManager = require('../UserManager');
var SessionInfo = require('./../../entities/values/SessionInfo');
var constant = require('../../constant');

/**
 * This method creates the unique token strategy for the user's login (passport module)
 *
 * @returns {UniqueTokenStrategy}
 */
module.exports = function () {
  return new UniqueTokenStrategy(
      {
        tokenParams: 'authtoken',
        tokenHeader: 'x-auth-token',
        passReqToCallback: true
      },
      function (req, token, done) {
        UserManager.loadByHashToken(token).then(function (user) {
          if (!user) {
            throw 1000;
          }
          return user.load();
        }).then(
            function (user) {
              done(null, user);
            }
        ).catch(function (err) {
              if (err === 1000) {
                return done(null, false, {
                  result: 401,
                  message: 'Invalid auth.'
                });
              }
              return done(null, false, {
                result: 500,
                message: 'System error'
              });
            }
        );
      }
  );
};
