var ejs = require('ejs');
var ajaxMessage = require('df-ajax');
var templateManager = require('df-template-manager');

var di = require('../di');

var UserManager = require('../business/UserManager');
var filter = require('../business/filters/NewUser');

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
for (lang in config.mail.confirmRegistration) {
  if (config.mail.confirmRegistration.hasOwnProperty(lang)) {
    mailTemplates[lang] =
        templateManager.addTemplate(
            config.mail.confirmRegistration[lang].template,
            config.mail.confirmRegistration[lang].encoding);
  }
}

module.exports = function(req, res, next) {
  var fields = req.body.fields;
  var returnMessage = new ajaxMessage.AjaxFormMessage();

  if (typeof fields !== 'object') {
    return ajaxMessage.sendErrorMessage(res, 1001, 'Inconsistent data');
  }

  filter.sanitize(fields);
  filter.validate(fields, returnMessage).then(
      function() {
        if (returnMessage.hasError()) {
          throw 1000;
        }
        return UserManager.createNewUser(
            fields.username, fields.password, fields.username, '', '', '');
      }
  ).then(function(user) {
        return user.load();
      }
  ).then(function(user) {

        var baseUrl = config.baseurl;
        var url = baseUrl +
            '/free/confirm/' + user.getConfirmationToken().getToken();

        /*jshint sub:true */
        var mailHtml =
            ejs.render(templateManager.getTemplate(
                mailLayoutTemplates['it_IT']), {
              'title': config.mail.autoLogin['it_IT'].subject,
              baseurl: baseUrl,
              'content': ejs.render(
                  templateManager.getTemplate(mailTemplates['it_IT']), {
                    name: user.getName(),
                    surname: user.getSurname(),
                    email: user.getEmail(),
                    baseurl: baseUrl,
                    url: url
                  }
              )
            });

        try {
          var Mailer = require('../di').getMailer();
          var mail = new Mailer();
          mail.setTo(user.getEmail());
          mail.setSubject(config.mail.autoLogin['it_IT'].subject);
          mail.setBodyHtml(mailHtml);
          mail.sendMail();
        } catch (e) {
          console.log(e);
        }

        return ajaxMessage.sendValue(res, user.getLoggedAccountArray());
      }
  ).catch(function(err) {
        if (err === 1000) {
          return returnMessage.send(res);
        }
        di.getLogger().info(err);
        return ajaxMessage.sendErrorMessage(res, 500, 'User creation error');
      }
  );
};
