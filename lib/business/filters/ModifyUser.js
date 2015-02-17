var validator = require('validator');

var sanitize = function(params, callback) {
  params.name = validator.toString(params.name);
  params.name = validator.trim(params.name);

  params.surname = validator.toString(params.surname);
  params.surname = validator.trim(params.surname);

  callback(null);
};

/**
 *
 * @param {{}} params
 * @param {AjaxFormMessage} errors
  */
var validate = function(params, errors, callback) {
  if (!validator.isLength(params.name, 2, 50)) {
    errors.addError('name',
        'La lunghezza del nome deve essere compresa tra 2 e 50 caratteri.');
  }
  if (!validator.isLength(params.surname, 2, 50)) {
    errors.addError('surname',
        'La lunghezza del cognome deve essere compresa tra 2 e 50 caratteri.');
  }
  callback();
};

module.exports = {
  sanitize: sanitize,
  validate: validate
};
