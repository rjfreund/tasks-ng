var app = angular.module('tasks');

app.controller("LoginController", ['$scope', '$state', 'Security', '$stateParams',
    function($scope, $state, Security, $stateParams) {          
    $scope.login = function(credentials){
        if (!credentials.email){ alert("Email is invalid."); return; }
        if (!credentials.password){ alert("Password is invalid"); return; }
        Security.login(credentials.email, credentials.password)
        .then(function(token){
            if ($stateParams.continueState){ 
                $state.go($stateParams.continueState); 
                return;
            }
            $state.go('home');
        }, function(error){
            alert(error);
        });
    };
}]);