var app = angular.module("tasks");
app.controller("HomeController", ['$scope', '$state', 'Security', '$http', '$q', function($scope, $state, Security, $http, $q){
	$scope.logout = function(){ Security.logout(); $state.go('login'); };
	$scope.tasks = [];
	$scope.isUserAuthenticated = false;
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
	$scope.setUserAuthentication = function(){
		Security.isUserAuthenticated().then(function(userIsAuthenticated){
			$scope.isUserAuthenticated = userIsAuthenticated;
		}, function(userIsNotAuthenticated){
			$scope.isUserAuthenticated = userIsNotAuthenticated;
		});
	};
	$scope.displayQuickAdd = true;
	$scope.toggleQuickAdd = function(){ $scope.displayQuickAdd = !$scope.displayQuickAdd; };
	$scope.quickAddTaskSubmit = function(){
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
			$scope.getTasks();
		}), function error(response){
			console.error(response);
			//TODO: need to add user_id to the post of the task in api
			//also finish reorganizing api routes into schema and table folders
		};
	};

	$scope.setUserAuthentication();
	$scope.getTasks();	
}]);