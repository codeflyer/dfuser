var ajaxMessage = require('df-ajax');
var Factory = require('entityx').Factory;

module.exports = function(req, res) {
  var userDriver = Factory.getRepository('User/User');
  userDriver.mongoDbFindToArray({}, {'email': 1}).then(
      function(results) {
        var returnStruct = results.map(function(item) {
          return [item.email];
        });
        res.csv(returnStruct);
      }
  ).catch(
      function(err) {
        console.log(err.stack);
        return ajaxMessage.sendErrorMessage(res, 500, err);
      });
};
