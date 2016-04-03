var app = angular.module('emcinv', ['ui.bootstrap','smart-table']);

app.controller('dropdown', function($scope,$http) {
  $scope.selectedCustomer = "Select Customer";
  $http.get('customers.json').success(function(data) {
    $scope.customerList = data;
  });

  $scope.getInventory = function(selectedCustomer) {
    $scope.selectedCustomer = selectedCustomer.name;
  }
});

app.controller('table', function($scope) {
  $scope.safeInstallData = GetInstallBase.getInstallBase();
});


app.factory("GetInstallBase", function(

