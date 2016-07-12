var app = angular.module('tasks');

app.controller("LoginController", ['$scope', function($scope) {
    $scope.login = function(credentials){
        $http({
            method: 'POST',
            url: 'api.rjfreund.com/task-tracker/authenticate',
            data: credentials
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.dir(response);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.dir(response);
        });
    };
}]);