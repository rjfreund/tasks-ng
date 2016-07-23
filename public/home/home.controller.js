var app = angular.module("tasks");
app.controller("HomeController", ['$scope', '$state', 'Security', '$http', '$q', function($scope, $state, Security, $http, $q){
	$scope.logout = function(){ Security.logout(); $state.go('login'); };
	$scope.tasks = [];
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
	$scope.isUserAuthenticated = false;
	$scope.checkUserAuthentication = function(){
		Security.isUserAuthenticated().then(function(userIsAuthenticated){
			$scope.isUserAuthenticated = userIsAuthenticated;
		}, function(userIsNotAuthenticated){
			$scope.isUserAuthenticated = userIsNotAuthenticated;
		});
	};
	$scope.checkUserAuthentication();
	$scope.getTasks();	
}]);