var Promise = require('bluebird');
var ajaxMessage = require('df-ajax');
var AjaxDataTable = ajaxMessage.AjaxDataTable;
var RoleManager = require('../../business/RoleManager');

module.exports = function(req, res) {
  var ajaxDataTable = new AjaxDataTable();
  var usersFound;
  RoleManager.countUsersWithRole(
      req.currentRole, req.dfcore.paginator.filters
  ).then(
      function(count) {
        if (count === 0) {
          ajaxDataTable.init(ajaxMessage.CalcFilter(0, 0, 10));
          /* jshint newcap: false */
          return Promise.resolve([]);
        }

        var paginator = ajaxMessage.CalcFilter(
            req.dfcore.paginator.currentPage,
            count, req.dfcore.paginator.resultsPerPage);
        ajaxDataTable.init(paginator);

        return RoleManager.getUsersWithRole(
            req.currentRole,
            req.dfcore.paginator.filters,
            req.dfcore.paginator.orderBy, paginator.skip, paginator.limit);
      }
  ).then(
      function(users) {
        usersFound = users;
        var promiseList = [];
        for (var i = 0, len = users.length; i < len; i++) {
          promiseList.push(users[i].load());
        }
        return Promise.all(promiseList);
      }).then(
      function(users) {
        for (var i = 0, len = users.length; i < len; i++) {
          var user = users[i];
          ajaxDataTable.addItem({
            'id': user.getId(),
            'username': user.getUsername(),
            'name': user.getName(),
            'surname': user.getSurname(),
            'email': user.getEmail()
          });
        }
        return ajaxDataTable.send(res);
      }
  ).catch(
      function(err) {
        return ajaxMessage.sendErrorMessage(res, 500, err);
      });
};
