var app = angular.module('tasks', ['ui.router', 'ui.router.title', 'ngSanitize', 'ngResource', 'ui.bootstrap', 'oc.lazyLoad', 'chart.js']);

app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$resourceProvider",
    function($stateProvider, $urlRouterProvider, $locationProvider, $resourceProvider){
        $urlRouterProvider.otherwise("/");
        $resourceProvider.defaults.stripTrailingSlashes = false;        
        $locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state("home", {
                url: '/home/',
                templateUrl: '../home/home.html',
                requiresAuthentication: true                         
            })
            .state("login", {
                url: '/login/',
                templateUrl: '../login/login.html',
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../login/login.controller.js');
                    }]
                }
            });        
    }]);

app.factory("Security", ['$http','$q', function($http, $q){
    var token = null;

    function login(email, password){        
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/task-tracker/authenticate',
            data: { email: email, password: password}
        }).then(function successCallback(response) {
            if (!response.data.token){ console.error("token not in response data!!!!!"); return; }
            token = response.data.token;
            return response.data.token;
        }, function errorCallback(response) {
            if (!response.data){ return "Could not get response from login database."; }            
            return response.data.error;
        });        
    }

    function isUserAuthenticated(){
        return getToken().then(function(token){
            return true;
        }, function(error){
            return $q.reject(false);
        });
    }

    function authenticate(){
        return isUserLoggedIn().then(function(userIsLoggedIn){
            return userIsLoggedIn
        }, function(userIsNotLoggedIn){
            return $q.reject(userIsNotLoggedIn);
        });
    }

    function getToken(){ 
        var deferred = $q.defer();
        deferred.notify("About to get user token.");
        if (!token){ deferred.reject("Token not set."); return deferred.promise; }        
        deferred.resolve(token);
        return deferred.promise; 
    }
    return { 
        login: login, 
        getToken: getToken, 
        isUserAuthenticated: isUserAuthenticated,
        authenticate: authenticate
    };
}]);

app.run(['$rootScope', '$location', '$state', '$anchorScroll', 'Security',
    function($rootScope, $location, $state, $anchorScroll, Security){
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if (!toState.requiresAuthentication){ return; }
            Security.isUserAuthenticated().then(function(userIsAuthenicated){   
                console.log(userIsAuthenicated);
                //continue going to state         
            }, function(userIsNotAuthenicated){
                $state.go('login');
            });
        });    
    }
]);    