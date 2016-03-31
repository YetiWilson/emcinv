(function(){
  var app = angular.module("microsoft", ['smart-table','ngSanitize','ngCsv','nvd3','ui.bootstrap']);

  var pageNum = [
		{
			id: 15
		},
		{
			id: 30
		},
		{
			id: 45
		},
		{
			id: 60
		},
		{
			id: 75
		},
		{
			id: 90
		}
	];

  app.controller("MsInvController", function($scope, $http, InventoryFactory, $uibModal, $sce, $log) {
    $scope.companyList = new Array();
    $scope.selectedCustomer = "Select Customer";
		$http.get('customers.json').success(function(data) {
			$scope.companyList = data;
		});
    $scope.pageNums = pageNum;
    $scope.itemsByPage = 15;
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

		$scope.productName = function(product,sn) {
      if(product == "XTREMIO-NA") {
        return $sce.trustAsHtml("\<a ng-click\=\"open()\"\>"+sn+"\<\/a\>");
      } else {
        return sn;
      }
    }

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    }
		$scope.getData = function(selectedDuns,selectedName) {
			$scope.selectedCustomer = selectedName;
			InventoryFactory.getInv(selectedDuns).success(function(data) {
			$scope.myData = data['rows'];
			$scope.myPages = data['pages'];
			})
		};
	});

	app.factory("InventoryFactory", function($http) {
		return {
			getInv: function(dunId){
				return $http.get('http://pnwreport.bellevuelab.isus.emc.com/api/installs/' + dunId)
			}
		}
	});

  app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
})();
