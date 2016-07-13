var app = angular.module('tasks');

app.controller("LoginController", ['$scope', '$state', 'Security',
    function($scope, $state, Security) {
    $scope.login = function(credentials){
        if (!credentials.email){ alert("Email is invalid."); return; }
        if (!credentials.password){ alert("Password is invalid"); return; }
        Security.login(credentials.email, credentials.password)
        .then(function(token){
            $state.go('home');
        }, function(error){
            alert(error);
        });
    };
}]);