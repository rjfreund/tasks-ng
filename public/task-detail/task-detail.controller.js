var app = angular.module("tasks");
app.controller('TaskDetailController', 
['$scope', '$stateParams', 'apiHost', 'PrevState', '$http',
function($scope, $stateParams, apiHost, PrevState, $http){		
	$scope.task = {};
	if ($stateParams.formMode === 'edit' || $stateParams.formMode === 'view'){
		$http({method: "GET", url: apiHost + "/task-tracker/tasks/{id:'" + $stateParams.taskId + "'}"})
		.then(function success(res){
			$scope.task = formatTask(res.data);
		}, function fail(res){
			console.error(res);
		});
	}	
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
	$scope.cancel = function(){ PrevState.go(); }
	function formatTask(inputTask){
		var task = angular.copy(inputTask);
		if (task.creation_date){ task.creation_date = moment.utc(task.creation_date).local().toDate(); }
		if (task.modified_date){ task.modified_date = moment.utc(task.modified_date).local().toDate(); }
		if (task.assigned_date){ task.assigned_date = moment.utc(task.assigned_date).local().toDate(); }
		if (task.due_date){ task.due_date = moment.utc(task.due_date).local().toDate(); }
		return task;
	}
}]);