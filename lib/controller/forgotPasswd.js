var crypto = require('crypto');
var async = require('async');
var Type = require('type-of-is');
var ejs = require('ejs');
var templateManager = require('df-template-manager');
var ajaxMessage = require('df-ajax');
var ErrorX = require('codeflyer-errorx');

var UserManager = require('../business/UserManager');
var filter = require('../business/filters/ForgotPasswd');
var di = require('../di');

var ExpireToken = require('../entities/values/ExpireToken');

var config = di.getConfig();
var lang;
var mailLayoutTemplates = {};
for (lang in config.mail.mainLayout) {
  if (config.mail.mainLayout.hasOwnProperty(lang)) {
    mailLayoutTemplates[lang] =
        templateManager.addTemplate(
            config.mail.mainLayout[lang].template,
            config.mail.mainLayout[lang].encoding);
  }
}

var mailTemplates = {};
for (lang in config.mail.forgotPasswd) {
  if (config.mail.forgotPasswd.hasOwnProperty(lang)) {
    mailTemplates[lang] =
        templateManager.addTemplate(
            config.mail.forgotPasswd[lang].template,
            config.mail.forgotPasswd[lang].encoding);
  }
}

module.exports = function(req, res, next) {
  var fields = req.body.fields;
  var returnMessage = new ajaxMessage.AjaxFormMessage();

  if (typeof fields !== 'object') {
    return ajaxMessage.sendErrorMessage(res, 1001, 'Inconsistent data');
  }

  var currentUser;
  async.waterfall(
      [
        function(callback) {
          di.getLogger().info('Sanitaize');
          filter.sanitize(fields, callback);
        },
        function(callback) {
          di.getLogger().info('Validate');
          filter.validate(fields, returnMessage, callback);
        },
        function(callback) {
          di.getLogger().info('Create cripty');
          if (returnMessage.hasError()) {
            return callback(ajaxMessage.constants.ERROR_FORM_FIELDS);
          }
          crypto.randomBytes(config.hashCost, function(err, buf) {
            if (err) {
              return callback(new ErrorX(
                  1100, 'Errore nella creazione del crypto hash cost', err));
            }
            var token = buf.toString('hex');
            callback(null, token);
          });
        },
        function(token, callback) {
          di.getLogger().info('Load');
          UserManager.loadByUsername(fields.username).then(
              function(user) {
                currentUser = user;
                if (!currentUser) {
                  throw new ErrorX(
                      403, 'Errore! Non esiste alcun account con ' +
                      'questo indirizzo email!');
                }
                return currentUser.load();
              }
          ).then(
              function() {
                di.getLogger().info('prepare');
                var resetPasswordToken = new ExpireToken({
                  'token': token,
                  'expire': Date.now() + config.expiresToken
                });
                currentUser.setResetPasswordToken(resetPasswordToken);
                return currentUser.storeFields(['resetPasswordToken']);
              }
          ).then(
              function() {
                di.getLogger().info('reload');
                return currentUser.load();
              }
          ).then(
              function() {
                var baseUrl = config.baseurl;
                /*jshint sub:true */
                var url = baseUrl + '/user/reset/' +
                    currentUser.getResetPasswordToken().getToken();
                di.getLogger().info(url);
                var mailHtml =
                    ejs.render(
                        templateManager.getTemplate(
                            mailLayoutTemplates['it_IT']), {
                          'title': config.mail.forgotPasswd['it_IT'].subject,
                          'baseurl': baseUrl,
                          'content': ejs.render(
                              templateManager.getTemplate(
                                  mailTemplates['it_IT']
                              ), {
                                email: currentUser.getEmail(),
                                name: currentUser.getName(),
                                surname: currentUser.getSurname(),
                                baseurl: baseUrl,
                                url: url
                              }
                          )
                        });
                var Mailer = require('../di').getMailer();
                var mail = new Mailer();
                mail.setTo(currentUser.getEmail());
                mail.setSubject(config.mail.forgotPasswd['it_IT'].subject);
                mail.setBodyHtml(mailHtml);
                mail.setAutoConvertText();
                mail.sendMail();

                callback();
              }
          ).catch(
              function(err) {
                return callback(err);
              }
          );
        }
      ],
      function(err) {
        if (Type.is(err, ErrorX)) {
          return ajaxMessage.sendErrorMessage(res, err.err, err.message);
        }
        if (err === ajaxMessage.constants.ERROR_FORM_FIELDS) {
          return returnMessage.send(res);
        } else if (err) {
          di.getLogger().error(err.getLogMessage());
          return ajaxMessage.sendErrorMessage(res, err.code, err.message);
        }
        return ajaxMessage.sendValue(res, {});
      }
  );
};
