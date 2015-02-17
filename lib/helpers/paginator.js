var ajaxMessage = require('modules/ajax-message');
var Type = require('type-of-is');

module.exports = function() {
  return function(req, res, next) {
    try {
      var fields = req.body;

      if (!Type.is(fields.filters, Object)) {
        return ajaxMessage.sendErrorMessage(
            res, 1001, 'Inconsistent data [filter not set]');
      }

      var paginator = {
        filters: fields.filters,
        currentPage: fields.page,
        resultsPerPage: fields.resultsPerPage,
        orderBy: fields.orderBy
      };

      if (req.dfcore == null) {
        req.dfcore = {};
      }
      req.dfcore.paginator = paginator;
      next();
    } catch (e) {
      console.log('Error');
      console.log(err);
      if (err.code === 404) {
        return ajaxMessage.sendErrorMessage(res, 404, 'Role not exists');
      }
      return ajaxMessage.sendErrorMessage(res, 422, 'Inconsistent data');
    }
  };
}();
