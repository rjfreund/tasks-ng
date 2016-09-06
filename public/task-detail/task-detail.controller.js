var app = angular.module("tasks");
app.controller('TaskDetailController', 
['$scope', '$stateParams', 'apiHost',
function($scope, $stateParams, apiHost){	
	$scope.task = $stateParams.task;
	$scope.formMode = $stateParams.formMode;
	$scope.save = function(){
		if ($scope.formMode === 'edit'){
			
			return;
		}
		if ($scope.formMode === 'add'){
			$http({
			method: "POST",
			url: apiHost + "/task-tracker/tasks",
			data: {
				name: $scope.task.name,
				assigned_date: moment.utc().format(),
				due_date: moment.utc().format()
			}
			}).then(function success(response){
				form.$setPristine();
				form.$setUntouched();			
				$scope.task = {};	    
				$scope.getTasks();
			}), function error(response){
				console.error(response);
			};
			return;
		}
	}
}]);