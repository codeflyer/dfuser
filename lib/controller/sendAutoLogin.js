var async = require('async');
var crypto = require('crypto');
var Type = require('type-of-is');
var ejs = require('ejs');
var templateManager = require('df-template-manager');
var ajaxMessage = require('df-ajax');
var ErrorX = require('codeflyer-errorx');

var di = require('../di');
var UserManager = require('../business/UserManager');
var filter = require('../business/filters/ForgotPasswd');
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
for (lang in config.mail.autoLogin) {
  if (config.mail.autoLogin.hasOwnProperty(lang)) {
    mailTemplates[lang] =
        templateManager.addTemplate(
            config.mail.autoLogin[lang].template,
            config.mail.autoLogin[lang].encoding);
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
          filter.sanitize(fields, callback);
        },
        function(callback) {
          filter.validate(fields, returnMessage, callback);
        },
        function(callback) {
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
          UserManager.loadByUsername(fields.username).then(
              function(user) {
                currentUser = user;
                if (!currentUser) {
                  throw new ErrorX(
                      403,
                      'Errore! Non esiste alcun account con' +
                      ' questo indirizzo email!');
                }
                return currentUser.load();
              }
          ).then(
              function() {
                var autoLoginToken = new ExpireToken(
                    {
                      'token': crypto.randomBytes(
                          config
                              .randomBytesAutoLoginToken).toString('hex'),
                      'expire': Date.now() + config.expiresAutoLoginToken,
                      'params': {}
                    });
                currentUser.setAutoLoginToken(autoLoginToken);
                return currentUser.storeFields(['autoLoginToken']);
              }
          ).then(
              function() {
                return currentUser.load();
              }
          ).then(
              function() {
                /*jshint sub:true */
                var baseUrl = config.baseurl;
                var url = baseUrl + '/free/autologin/' +
                    currentUser.getAutoLoginToken().getToken();
                di.getLogger().info(url);

                var content =
                    ejs.render(
                        templateManager.getTemplate(mailTemplates['it_IT']), {
                          email: currentUser.getEmail(),
                          name: currentUser.getName(),
                          surname: currentUser.getSurname(),
                          baseurl: baseUrl,
                          url: url
                        }
                    );
                // jcsc:disable maximumLineLength
                var mailHtml =
                    ejs.render(
                        templateManager.getTemplate(
                            mailLayoutTemplates['it_IT']
                        ), {
                          title: config.mail.autoLogin['it_IT'].subject,
                          baseurl: baseUrl,
                          content: content
                        }
                    );
                var Mailer = require('../di').getMailer();
                var mail = new Mailer();
                mail.setTo(currentUser.getEmail());
                mail.setSubject(config.mail.autoLogin['it_IT'].subject);
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
