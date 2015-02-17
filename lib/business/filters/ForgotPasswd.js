var validator = require('validator');

var sanitize = function(params, callback) {
  params.username = validator.toString(params.username);
  params.username = validator.trim(params.username);
  params.username = params.username.toLowerCase();
  callback(null);
};

/**
 *
 * @param {{}} params
 * @param {AjaxFormMessage} errors
 */
var validate = function(params, errors, callback) {
  if (!validator.isLength(params.username, 5, 255)) {
    errors.addError('username',
        'La lunghezza dello username deve essere compresa tra ' +
        '5 e 255 caratteri.');
  } else if (!validator.isEmail(params.username)) {
    errors.addError('username',
        'Il campo username deve essere una email valida.');
  }

  callback();
};

module.exports = {
  sanitize: sanitize,
  validate: validate
};
