var app = angular.module("tasks");
app.controller("TasksController", 
['$scope', '$state', '$http', '$q', '$state', 'apiHost', '$stateParams', 'TaskActions',
function($scope, $state, $http, $q, $state, apiHost, $stateParams, TaskActions){	
	$scope.tasks = [];
	$scope.quickAddTask = {};
	$scope.completeTask = function(task){ 
		task.is_complete = true; 
		TaskActions.setCompletionDate(task);
		TaskActions.saveEdit(task).then(function success(res){ $scope.getTasks(); }, function fail(res){ console.error(res); });		
	};
	$scope.areAddTaskButtonsHidden = function(){ if($stateParams.areAddTaskButtonsHidden){ return $stateParams.areAddTaskButtonsHidden; } return false; };	
	$scope.getDaysLeft = function(task){ if(moment(task.due_date).isValid()){ return moment(task.due_date).diff(moment(), 'days'); } };
	$scope.getTasks = function(){
		TaskActions.getTasks($stateParams.filter, $stateParams.orderBy)
		.then(function success(response){			
			$scope.tasks = response.data;
		}, function error(response){			
			console.error(response);
		});
	};	
	$scope.quickAddTaskSubmit = function(form){
		console.log($scope.quickAddTask);
		$http({
			method: "POST",
			url: apiHost + "/task-tracker/tasks",
			data: {
				name: $scope.quickAddTask.name,
				assigned_date: moment.utc().format(), //TODO: get date.now as utc
				due_date: moment.utc().format()
			}
		}).then(function success(response){
			form.$setPristine();
			form.$setUntouched();			
			$scope.quickAddTask = {};	    
			$scope.getTasks();
		}), function error(response){
			console.error(response);
		};
	};	
	$scope.delete = function(task){
		TaskActions.deleteTask(task)
		.then(function(response){
			$scope.getTasks();
		}, function(response){
			console.log(response);
		});
	};
	$scope.collapseQuickAdd = true;
	$scope.toggleQuickAdd = function(){ $scope.collapseQuickAdd = !$scope.collapseQuickAdd; };
	$scope.getTasks();
}])