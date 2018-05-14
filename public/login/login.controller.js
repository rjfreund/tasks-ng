var app = angular.module('tasks');

app.controller("LoginController", ['$scope', '$state', 'Security', '$stateParams',
function($scope, $state, Security, $stateParams) {   
    $scope.credentials = { email: null, password: null };            
    $scope.error = '';
    $scope.login = function(credentials){
        $scope.error = '';
        if (!credentials.email){ $scope.error="Email is invalid."; return; }
        if (!credentials.password){ $scope.error="Password is invalid"; return; }
        Security.login(credentials.email, credentials.password)
        .then(function(token){
            if ($stateParams.continueState){ 
                $state.go($stateParams.continueState); 
                return;
            }
            $state.go('todo');
        }, function(response){
            if (response.status == -1){ $scope.error = "Could not connect to database server."; return; }
            $scope.error = response.data;
        });
    };
}]);