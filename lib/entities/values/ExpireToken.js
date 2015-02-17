var defineExpireTokenStruct = require('../../structs/expireToken.json');
var Builder = require('entityx').Builder;

var ExpireToken = Builder.buildValueObject(defineExpireTokenStruct);
module.exports = ExpireToken;
