var app = angular.module("tasks");
app.controller("TasksController", ['$scope', '$state', '$http', '$q', function($scope, $state, $http, $q){
	$scope.tasks = [];
	$scope.quickAddTask = {};
	$scope.getTasks = function(){
		var options = {
		  method: 'GET',
		  url: 'http://localhost:3000/task-tracker/tasks/'
		};
		$http(options).then(function success(response){
			console.log(response);
			$scope.tasks = response.data;
		}, function error(response){
			console.log("error");
			console.log(response);
		});
	};	
	$scope.quickAddTaskSubmit = function(form){
		console.log($scope.quickAddTask);
		$http({
			method: "POST",
			url: "http://localhost:3000/task-tracker/tasks",
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
			//TODO: need to add user_id to the post of the task in api
			//also finish reorganizing api routes into schema and table folders
		};
	};
	$scope.delete = function(task, form){
		$http({
			method: 'DELETE',
			url: 'http://localhost:3000/task-tracker/tasks/' + task.id,			
		}).then(function(response){
			$scope.getTasks();
		});
	};
	$scope.collapseQuickAdd = true;
	$scope.toggleQuickAdd = function(){ $scope.collapseQuickAdd = !$scope.collapseQuickAdd; };
	$scope.getTasks();
}])