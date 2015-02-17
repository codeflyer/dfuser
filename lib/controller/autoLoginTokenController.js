var passport = require('passport');
var ErrorX = require('codeflyer-errorx');
var acl = require('./../acl');

module.exports = function(req, res, next) {
  passport.authenticate('local-autologin-token', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new ErrorX(403, 'Permission denied!'));
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      user.load().then(
          function() {
            return user.resetRoles(acl);
          }).then(function() {
            res.redirect('/user/');
          });

    });
  })(req, res, next);
};
