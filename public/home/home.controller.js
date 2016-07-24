var app = angular.module("tasks");
app.controller("HomeController", ['$scope', '$state', 'Security', '$http', '$q', function($scope, $state, Security, $http, $q){
	$scope.logout = function(){ Security.logout(); $state.go('login'); };
	$scope.tasks = [];
	$scope.isUserAuthenticated = false;
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
	$scope.checkUserAuthentication = function(){
		Security.isUserAuthenticated().then(function(userIsAuthenticated){
			$scope.isUserAuthenticated = userIsAuthenticated;
		}, function(userIsNotAuthenticated){
			$scope.isUserAuthenticated = userIsNotAuthenticated;
		});
	};
	$scope.displayQuickAdd = true;
	$scope.toggleQuickAdd = function(){ $scope.displayQuickAdd = !$scope.displayQuickAdd; };
	$scope.quickAddTaskSubmit = function(){
		$http({
			method: "POST",
			url: "http://localhost:3000/task-tracker/tasks",
			data: {
				name: this.quickAddTaskName,
				assigned_date: "", //TODO: get date.now as utc
				due_date: ""
			}
		});
	};

	$scope.checkUserAuthentication();
	$scope.getTasks();	
}]);