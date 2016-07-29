var app = angular.module('tasks');

app.controller("SignupController", ['$scope', '$state', 'Security',
    function($scope, $state, Security) {
    $scope.signup = function(credentials){
        if (!credentials.email){ alert("Email is invalid."); return; }
        if (!credentials.password){ alert("Password is invalid"); return; }
        Security.signup(credentials.email, credentials.password)
        .then(function(response){
            
        }, function(error){
            alert(error);
        });
    };
}]);