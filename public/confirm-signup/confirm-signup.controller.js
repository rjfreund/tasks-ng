var app = angular.module("tasks");

app.controller("ConfirmSignupController", ['$scope', '$stateParams', 'Security', '$state', '$http', 'apiHost', function($scope, $stateParams, Security, $state, $http, apiHost){
	$http({
        method: 'POST',
        url: apiHost + '/task-tracker/confirm-signup',
        data: { signupId: $stateParams.signupId }
    }).then(function success(response){
    	Security.loginWithToken(response.data.token)
    	.then(function(token){
    		$state.go('home');
    	});
    }, function fail(response){
    	console.error(response);
    });
}]);