var app = angular.module("tasks");
app.controller("HomeController", ['$scope', '$state', 'Security', '$http', '$q', function($scope, $state, Security, $http, $q){
	$scope.logout = function(){ Security.logout(); $state.go('login'); };
	
	$scope.isUserAuthenticated = false;
	
	$scope.setUserAuthentication = function(){
		Security.isUserAuthenticated().then(function(userIsAuthenticated){
			$scope.isUserAuthenticated = userIsAuthenticated;
		}, function(userIsNotAuthenticated){
			$scope.isUserAuthenticated = userIsNotAuthenticated;
		});
	};	

	$scope.setUserAuthentication();	
}]);