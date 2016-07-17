var app = angular.module("tasks");
app.controller("HomeController", ['$scope', '$state', 'Security', function($scope, $state, Security){
	$scope.logout = function(){ Security.logout(); $state.go('login'); };
}]);