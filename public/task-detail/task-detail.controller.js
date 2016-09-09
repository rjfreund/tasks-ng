var app = angular.module("tasks");
app.controller('TaskDetailController', 
['$scope', '$stateParams', 'apiHost', '$http', 'DatetimeFormatter', '$state', 'PrevState', 'TaskManager',
function($scope, $stateParams, apiHost, $http, DatetimeFormatter, $state, PrevState, TaskManager){		
	$scope.task = {};
	if ($stateParams.formMode === 'edit' || $stateParams.formMode === 'view'){
		TaskManager.getSingleTask($stateParams.taskId)
		.then(function success(res){
			$scope.task = DatetimeFormatter.toLocal(res.data[0], ['creation_date', 'modified_date', 'assigned_date', 'due_date', 'completion_date']);
			console.log($scope.task);
		}, function fail(res){
			console.error(res);
		});
	}	
	$scope.setCompletionDate = function(task){ TaskManager.setCompletionDate(task); };
	$scope.setAssignedDateToToday = function(task){ TaskManager.setAssignedDateToToday(task); }
	$scope.getDaysLeft = function(task){ 
		if (!moment(task.due_date).isValid()){ return ""; }
		return moment(task.due_date).diff(moment(), 'days'); };
	$scope.formMode = $stateParams.formMode;
	$scope.save = function(){		
		if ($scope.formMode === 'edit'){
			TaskManager.saveEdit($scope.task)
			.then(function success(res){
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				PrevState.go();
			}, function fail(res){
				console.error(res);
			});
			return;
		}
		if ($scope.formMode === 'add'){
			TaskManager.saveAdd($scope.task)
			.then(function success(response){
				$scope.form.$setPristine();
				$scope.form.$setUntouched();			
				$scope.task = {};		
				PrevState.go();	
			}), function error(response){
				console.error(response);
			};
			return;
		}
	}
	$scope.cancel = function(){ PrevState.go(); }
}]);