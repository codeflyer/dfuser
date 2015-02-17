var Q = require('q');
var ajaxMessage = require('df-ajax');
var AjaxDataTable = ajaxMessage.AjaxDataTable;
var RoleManager = require('../../business/RoleManager');

module.exports = function(req, res) {
  var ajaxDataTable = new AjaxDataTable();
  var rolesFound;
  RoleManager.countRoles(req.dfcore.paginator.filters).then(
      function(count) {
        if (count === 0) {
          ajaxDataTable.init(ajaxMessage.CalcFilter(0, 0, 10));
          /* jshint newcap: false */
          return Q([]);
        }

        var paginator = ajaxMessage.CalcFilter(
            req.dfcore.paginator.currentPage,
            count,
            req.dfcore.paginator.resultsPerPage);
        ajaxDataTable.init(paginator);

        return RoleManager.getRoles(
            req.dfcore.paginator.filters,
            req.dfcore.paginator.orderBy,
            paginator.skip,
            paginator.limit);
      }
  ).then(
      function(roles) {
        rolesFound = roles;
        var promiseList = [];
        for (var i = 0, len = roles.length; i < len; i++) {
          promiseList.push(roles[i].load());
        }
        return Q.all(promiseList);
      }).then(
      function(roles) {
        for (var i = 0, len = roles.length; i < len; i++) {
          var role = roles[i];
          ajaxDataTable.addItem({
            'id': role.getId(),
            'name': role.getName(),
            'isAdminRole': role.getIsAdminRole()
          });
        }
        return ajaxDataTable.send(res);
      }
  ).catch(
      function(err) {
        console.log(err.stack);
        return ajaxMessage.sendErrorMessage(res, 500, err);
      });
};
