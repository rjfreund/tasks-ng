var app = angular.module("tasks");

app.controller("ConfirmSignupController", ['$scope', '$stateParams', 'Security', '$state', '$http', 'apiHost', '$q',
function($scope, $stateParams, Security, $state, $http, apiHost, $q){
    $scope.success = false;
    $scope.error = false;
    $scope.errorMessage;
	$http({
        method: 'POST',
        url: apiHost + '/task-tracker/confirm-signup',
        data: { signupId: $stateParams.signupId }
    }).then(function success(response){
        console.log(response);
    	$scope.success = true;
        $scope.error = false;
    }, function fail(response){
    	console.error(response);
        $scope.success = false;
        $scope.error = true;
        $scope.errorMessage = response;
    });
}]);