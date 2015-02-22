var validator = require('validator');
var UserManager = require('../UserManager');
var Promise = require('bluebird');

var sanitize = function(params) {
  params.username = validator.toString(params.username);
  params.username = validator.trim(params.username);
  params.username = params.username.toLowerCase();

//    params.name = validator.toString(params.name);
//    params.name = validator.trim(params.name);
//
//    params.surname = validator.toString(params.surname);
//    params.surname = validator.trim(params.surname);

  params.password = validator.toString(params.password);
  params.password = validator.trim(params.password);

//    params.confirmPassword = validator.toString(params.confirmPassword);
//    params.confirmPassword = validator.trim(params.confirmPassword);

//    params.locale = validator.toString(params.locale);
//    params.locale = validator.trim(params.locale);

  return params;
};

/**
 *
 * @param {{}} params
 * @param {AjaxFormMessage} errors
 * @param {*} done
 */
var validate = Promise.method(function(params, errors) {
  if (!validator.isLength(params.username, 5, 255)) {
    errors.addError('username',
        'La lunghezza dello username deve essere compresa tra ' +
        '5 e 255 caratteri.');
  } else if (!validator.isEmail(params.username)) {
    errors.addError('username', 'Email non valida.');
  }
//    if(!validator.isLength(params.name, 2, 50)) {
//        errors.addError('name', 'La lunghezza del nome deve essere compresa tra 2 e 50 caratteri.');
//    }
//    if(!validator.isLength(params.surname, 2, 50)) {
//        errors.addError('surname', 'La lunghezza del cognome deve essere compresa tra 2 e 50 caratteri.');
//    }
  if (!validator.isLength(params.password, 6, 16)) {
    errors.addError('password',
        'La lunghezza della password deve essere compresa tra ' +
        '6 e 16 caratteri.');
  }
//    if(!validator.equals(params.password, params.confirmPassword)) {
//        errors.addError('confirmPassword', 'La password non coincide.');
//    }

  return UserManager.loadByUsername(params.username).then(
      function(user) {
        if (user) {
          return user.load();
        }
        /* jshint newcap: false  */
        return Promise.resolve();
      }
  ).then(
      function(user) {
        if (user) {
          if (!user.getIsActive()) {
            errors.addError('username',
                'L\'email inserita risulta essere già registrata ' +
                'ma non ancora confermata.');
          } else {
            errors.addError('username',
                'L\'email inserita risulta essere già registrata.');
          }
        }
        return;
      }
  ).catch(function(err) {
        throw err;
      }
  );
});

module.exports = {
  sanitize: sanitize,
  validate: validate
};
