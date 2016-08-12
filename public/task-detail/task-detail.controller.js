var app = angular.module("tasks");
app.controller('TaskDetailController', 
['$scope', '$stateParams',
function($scope, $stateParams){	
	$scope.task = $stateParams.task;
	$scope.formMode = $stateParams.formMode;
}]);