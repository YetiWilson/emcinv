var app = angular.module('emcinv', ['ui.bootstrap','smart-table']);

app.controller('InstallBaseController', function($scope,$http,$uibModal) {
  $scope.selectedCustomer = "Select Customer";
  $http.get('customers.json').success(function(data) {
    $scope.customerList = data;
  });

  $scope.setIB = function(customer) {
    $scope.selectedCustomer = customer.name;
    $http.get('http://pnwreport.bellevuelab.isus.emc.com/api/installs/' + customer.id)
      .success(function(data) {
        $scope.safeInstallData = data['rows'];
      });
  };

  $scope.modelName = function(model) {
    switch(model) {
          case "SD-3D":
            return "VMAX 40K";
            break;
          case "SB-3D":
            return "VMAX (Orig)";
            break;
          case "BA-SYS1E":
            return "VMAX 10K";
            break;
          case "S2-3D":
            return "VMAX 20K";
            break;
          default:
            return model;
    }
  };

  $scope.open = function(sn) {
    var xtremioModal = $uibModal.open({
      animation: false,
      templateUrl: 'xtremioModalContent.html',
      controller: 'xtremioModalController',
      resolve: {
        sn: function() { return sn; }
      }
    });
  };

});

app.controller('xtremioModalController', function($scope,$http,$uibModalInstance,sn) {
  $http.get('http://pnwreport.bellevuelab.isus.emc.com/api/xtremio/' + sn)
    .success(function(data) {
      $scope.xtremioData = data['AllObjects'];
    });
});
