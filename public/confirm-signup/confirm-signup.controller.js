var app = angular.module("tasks");

app.controller("ConfirmSignupController", ['$scope', '$stateParams', 'Security', '$state', '$http', 'apiHost', '$q',
function($scope, $stateParams, Security, $state, $http, apiHost, $q){
	$http({
        method: 'POST',
        url: apiHost + '/task-tracker/confirm-signup',
        data: { signupId: $stateParams.signupId }
    }).then(function success(response){
    	return Security.loginWithToken(response.data.token)
    	.then(function success(token){
    		$state.go('todo');
    	}, function fail(res){
            console.error(res);
        });
    }, function fail(response){
    	console.error(response);
    });
}]);