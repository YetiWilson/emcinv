var app = angular.module('emcinv', ['ui.bootstrap','smart-table','ngSanitize','ngCsv']);

app.controller('InstallBaseController', function($scope,$http,$uibModal,$log,$compile) {
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
          case "X02-CTRLE-400-T-F":
            return "10TB Bricks";
            break;
          case "X02-CTRLE-T-F";
            return "20TB Bricks";
            break;
          case "X03-CTRLE-1600-T-F";
            return "40TB Bricks";
            break;
          default:
            return model;
    }
  };

  $scope.open = function(sn) {
    console.log(sn);
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'xtremioModalContent.html',
      controller: 'xtremioModalController',
      size: 'sm',
      resolve: {
        sn: function() { return sn; }
      }
    });
    modalInstance.result.then(function () {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.productName = function(row) {
    if(row.PRODUCT_FAMILY == "XTREMIO-NA") {
        return true;
      } else {
        return false;
      }
  }
});

app.controller('xtremioModalController', function($scope,$http,$uibModalInstance,sn) {
  $scope.sn = sn
  $scope.waiting = true;
  $scope.error = false;
  $http.get('http://pnwreport.bellevuelab.isus.emc.com/api/xtremio/' + $scope.sn)
    .success(function(data) {
      $scope.waiting = false;
      $scope.xtremioData = data;
    })
    .error(function(data) {
      $scope.waiting = false;
      $scope.error = true
    });
});

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    console.log(htmlCode);
    return $sce.trustAsHtml(htmlCode);
  }
}]);
