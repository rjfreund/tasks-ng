var app = angular.module("tasks");
app.controller("HomeController", ['$scope', '$state', 'Security', '$http', function($scope, $state, Security, $http){
	$scope.logout = function(){ Security.logout(); $state.go('login'); };
	$scope.tasks = [];
	$scope.getTasks = function(){
		$http({
		  method: 'GET',
		  url: 'http://localhost:3000/task-tracker/tasks'
		}).then(function success(response){
			console.log(response);
			$scope.tasks = response.data;
		}, function error(response){

		});
	};

	$scope.getTasks();
}]);