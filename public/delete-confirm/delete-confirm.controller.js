var app = angular.module("tasks");

app.controller("DeleteConfirmController",
['$scope', '$uibModalInstance',
function($scope, $uibModalInstance){
	$scope.delete = function(){ $uibModalInstance.close({action:'delete'}); };
	$scope.cancel = function(){ $uibModalInstance.close({action:'cancel'});	};
}]);