var validator = require('validator');

var sanitize = function(params, callback) {
  params.password = validator.toString(params.password);
  params.password = validator.trim(params.password);

  params.confirmPassword = validator.toString(params.confirmPassword);
  params.confirmPassword = validator.trim(params.confirmPassword);

  callback(null);
};

/**
 *
 * @param {{}} params
 * @param {AjaxFormMessage} errors
 */
var validate = function(params, errors, callback) {
  if (!validator.isLength(params.password, 6, 16)) {
    errors.addError('password',
        'La lunghezza della password deve essere compresa tra ' +
        '6 e 16 caratteri.');
  }
  if (!validator.equals(params.password, params.confirmPassword)) {
    errors.addError('password', 'La password non coincide.');
  }

  callback();
};

module.exports = {
  sanitize: sanitize,
  validate: validate
};
