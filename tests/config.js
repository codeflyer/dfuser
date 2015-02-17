var path = require('path');
var baseUrl = 'http://localhost:3000';

var config = {
  'hashCost': 64,
  'algorithm': 'md5',
  'expiresToken': 3600000,
  'randomBytesConfirmationToken': 32,
  'expiresConfirmationToken': 52596000,
  'randomBytesAutoLoginToken': 32,
  'expiresAutoLoginToken': (60 * 60 * 1000) * 24 * 7,
  'acl': {
    'redisPrefix': 'acl_'
  },
  baseUrl: baseUrl,
  mail: {
    confirmRegistration: {
      'it_IT': {
        template: path.join(__dirname, 'templates/confirmRegistration.it_IT.ejs'),
        encoding: 'UTF-8',
        subject: 'Welcome'
      }
    },
    forgotPasswd: {
      'it_IT': {
        template: path.join(__dirname, 'templates/forgotPasswd.it_IT.ejs'),
        encoding: 'UTF-8',
        subject: 'Reset password'
      }
    },
    autoLogin: {
      'it_IT': {
        template: path.join(__dirname, 'templates/autoLogin.it_IT.ejs'),
        encoding: 'UTF-8',
        subject: 'Autologin'
      }
    },
    mainLayout: {
      'it_IT': {
        template: path.join(__dirname, 'templates/mail-layout.it_IT.ejs'),
        encoding: 'UTF-8'
      }
    }
  }
};

module.exports = config;
