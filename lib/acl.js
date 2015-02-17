/**
 * Initialize module users
 *
 * @author Davide Fiorello <davide@codeflyer.com>
 */
var acl = require('acl');
var di = require('./di');
var client =
    require('redis').createClient(6379, '127.0.0.1', {'no_ready_check': true});
var config = di.getConfig('config');

module.exports =
    new acl(new acl.redisBackend(client, config.acl.redisPrefix));
