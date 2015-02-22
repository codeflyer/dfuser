var passport = require('passport');
var ajaxMessage = require('df-ajax');
var PubSubThen = require('pub-sub-then');

var di = require('../di');
var acl = require('./../acl');
var ExpireToken = require('../entities/values/ExpireToken');

module.exports = function(req, res, next) {
  var config = di.getConfig();
  passport.authenticate('local-user-password', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return ajaxMessage.sendErrorMessage(res, info.result, info.message);
    }
    req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }

          user.load().then(
              function() {
                return user.resetRoles(acl);
              }).then(
              function(roles) {
                var values = user.getLoggedAccountArray();
                values.roles = roles;
                PubSubThen.publish('user:prepareLoginData', user, values).then(
                    function() {
                      if (req.body.rememberMe) {
                        var crypto = require('crypto');
                        var token = crypto
                            .randomBytes(config.randomBytesAutoLoginToken)
                            .toString('hex');
                        var rememberMeToken = new ExpireToken(
                            {
                              'token': token,
                              'expire': Date.now() +
                              config.expireRememberMeToken || 3600
                            });
                        user.setRememberMeToken(rememberMeToken);
                        user.storeFields(['rememberMeToken']).then(
                            function() {
                              res.cookie('rememberMe', token, {
                                path: '/',
                                httpOnly: true,
                                maxAge: config.expireRememberMeToken
                              });
                              return ajaxMessage.sendValue(res, values);
                            }
                        ).catch(
                            function(err) {
                              return ajaxMessage.sendErrorMessage(
                                  res, 1100, 'Error in store fields user');
                            }
                        );
                      } else {
                        return ajaxMessage.sendValue(res, values);
                      }
                    }
                ).fail(
                    function(err) {
                      di.getLogger().error(err);
                      return ajaxMessage.sendErrorMessage(
                          res, 1100, 'Error in publish pubsub login');
                    }
                );
              }
          ).catch(function(err) {
                di.getLogger().error(err);
                return ajaxMessage.sendErrorMessage(
                    res, 1010, 'User load error');
              });
        }
    );
  })(req, res, next);
};
