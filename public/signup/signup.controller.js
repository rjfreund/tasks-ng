var app = angular.module('tasks');

app.controller("SignupController", ['$scope', '$state', 'Security',
    function($scope, $state, Security) {
    $scope.signup = function(credentials){
        if (!credentials.email){ alert("Email is invalid."); return; }
        if (!credentials.password){ alert("Password is invalid"); return; }
        if (!credentials.first_name){ alert("First name is invalid."); return; }
        if (!credentials.last_name){ alert("Last name is invalid"); return; }
        Security.signup(credentials.email, credentials.password, credentials.first_name, credentials.last_name)
        .then(function(response){
            console.log(response);
        }, function(error){
            alert(error);
        });
    };
}]);