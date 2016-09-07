var app = angular.module("tasks");
app.controller('TaskDetailController', 
['$scope', '$stateParams', 'apiHost', '$http', 'DatetimeFormatter', '$state',
function($scope, $stateParams, apiHost, $http, DatetimeFormatter, $state){		
	$scope.task = {};
	if ($stateParams.formMode === 'edit' || $stateParams.formMode === 'view'){
		$http({method: "GET", url: apiHost + "/task-tracker/tasks/{id:'" + $stateParams.taskId + "'}"})
		.then(function success(res){
			$scope.task = DatetimeFormatter.toLocal(res.data[0], ['creation_date', 'modified_date', 'assigned_date', 'due_date']);
		}, function fail(res){
			console.error(res);
		});
	}	
	$scope.getDaysLeft = function(task){ return moment(task.due_date).diff(moment(), 'days'); };
	$scope.formMode = $stateParams.formMode;
	$scope.save = function(){
		if ($scope.formMode === 'edit'){
			$http({
				method: "PUT",
				url: apiHost + "/task-tracker/tasks/" + $stateParams.taskId,
				data: DatetimeFormatter.toUTC($scope.task, ['creation_date', 'modified_date', 'assigned_date', 'due_date'])
			}).then(function success(res){
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				$state.go('tasks');
			}, function fail(res){
				console.error(res);
			});
			return;
		}
		if ($scope.formMode === 'add'){
			$http({
				method: "POST",
				url: apiHost + "/task-tracker/tasks",
				data: DatetimeFormatter.toUTC($scope.task, ['creation_date', 'modified_date', 'assigned_date', 'due_date'])
			}).then(function success(response){
				$scope.form.$setPristine();
				$scope.form.$setUntouched();			
				$scope.task = {};		
				$state.go('tasks');		
			}), function error(response){
				console.error(response);
			};
			return;
		}
	}
	$scope.cancel = function(){ $state.go('tasks'); }	
}]);