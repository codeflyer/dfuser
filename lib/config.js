/**
 * Require utils library
 */
var path = require('path');

var registry = require('simple-registry');

var ObjectMixer = require('modules/object-mixer');
var _baseViewPath = path.join(__dirname, '../views');

var config = new ObjectMixer({
  'hashCost': 64,
  'algorithm': 'md5',
  'expiresToken': 3600000,
  'randomBytesConfirmationToken': 32,
  'expiresConfirmationToken': 5259600,
  'randomBytesAutoLoginToken': 32,
  'expiresAutoLoginToken': 300000,
  'views': {
    'layout': _baseViewPath + '/layout/'
  }
});

var mainConfig = registry.get('config');
if (mainConfig != null) {
  config.ovveride(mainConfig.user);
}

module.exports = config;
