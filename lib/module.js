var EntityX = require('entityx').EntityX;
EntityX.addModule(__dirname);

var acl = require('./acl');
var rolesToAdd = [
  {
    roles: ['admin'],
    allows: [
      {resources: ['roles', 'users'], permissions: ['admin']}
    ]
  }];

acl.removeAllow('admin', ['roles', 'users'], ['admin']).then(
    function() {
      acl.allow(rolesToAdd);
    }
).catch(
    function(err) {
      require('../di').getLogger().err(err);
    }
);
