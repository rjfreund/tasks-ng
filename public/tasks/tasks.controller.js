var app = angular.module("tasks");
app.controller("TasksController", 
['$scope', '$state', '$http', '$q', '$state', 'apiHost',
function($scope, $state, $http, $q, $state, apiHost){	
	$scope.tasks = [];
	$scope.quickAddTask = {};
	$scope.daysLeft = function(task){
		//return moment().diff(task.due_date, 'days');
		return moment(task.due_date).diff(moment(), 'days');
	};
	$scope.getTasks = function(){
		var options = {
		  method: 'GET',
		  url: apiHost + '/task-tracker/tasks/'
		};
		$http(options).then(function success(response){			
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
	$scope.delete = function(task, form){
		$http({
			method: 'DELETE',
			url: apiHost + '/task-tracker/tasks/' + task.id,			
		}).then(function(response){
			$scope.getTasks();
		}, function(response){
			console.log(response);
		});
	};
	$scope.collapseQuickAdd = true;
	$scope.toggleQuickAdd = function(){ $scope.collapseQuickAdd = !$scope.collapseQuickAdd; };
	$scope.getTasks();
}])