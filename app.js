(function(){
  var app = angular.module("microsoft", ['smart-table','ngSanitize','ngCsv','nvd3']);

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

  app.controller("MsInvController", function($scope, $http, InventoryFactory) {
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
		$scope.options = {
			chart: {
				type: 'pieChart',
				height: 500,
				x: function(d){return d.key;},
				y: function(d){return d.y;},
				showLabels: true,
				duration: 500,
				labelThreshold: 0.01,
				labelSunbeamLayout: true,
				legend: {
					margin: {
						top: 5,
						right: 35,
						bottom: 5,
						left: 0
					}
				}
			}
		};

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

})();
