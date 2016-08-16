var app = angular.module('tasks', ['ui.router', 'ui.router.title', 'ngSanitize', 'ngResource', 'ui.bootstrap', 'mwl.calendar', 'oc.lazyLoad', 'chart.js', 'ngStorage']);

app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$resourceProvider",
    function($stateProvider, $urlRouterProvider, $locationProvider, $resourceProvider){
        $urlRouterProvider.otherwise("/");
        $resourceProvider.defaults.stripTrailingSlashes = false;        
        $locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state("home", {
                url: '/home/',
                views: {
                    '':{
                        controller: 'HomeController',
                        templateUrl: '../home/home.html',                        
                        resolve: { loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) { return $ocLazyLoad.load('../home/home.controller.js'); }] }  
                    }, 
                    'tasks@home' : {
                        controller: 'TasksController',
                        templateUrl: '../tasks/tasks.html',
                        resolve: { loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) { return $ocLazyLoad.load('../tasks/tasks.controller.js'); }] }  
                    }                        
                }                                            
            }).state("login", {
                url: '/login/',
                controller: 'LoginController',
                templateUrl: '../login/login.html',
                params: { continueState: null }, 
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../login/login.controller.js');
                    }]
                }
            }).state("signup", {
                url: '/signup/',
                controller: 'SignupController',
                templateUrl: '../signup/signup.html',
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../signup/signup.controller.js');
                    }]
                }
            }).state("confirm-signup", {
                url: '/confirm-signup/:signupId',
                controller: 'ConfirmSignupController',
                templateUrl: '../confirm-signup/confirm-signup.html',
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../confirm-signup/confirm-signup.controller.js');
                    }]
                }
            }).state("tasks", {
                url: '/tasks/',
                controller: "TasksController",    
                templateUrl: '../tasks/tasks.html',                                      
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../tasks/tasks.controller.js');
                    }]
                }              
            }).state('task-calendar', {
                url: '/tasks/calendar',
                controller: 'TaskCalendarController',
                templateUrl: '../task-calendar/task-calendar.html',
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../task-calendar/task-calendar.controller.js');
                    }]
                }
            }).state('editTask', {
                url: '/tasks/:taskId', 
                controller: 'TaskDetailController',               
                templateUrl: '../task-detail/task-detail.html',  
                params: {task: null, formMode: 'edit'},                                                         
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../task-detail/task-detail.controller.js');
                    }]
                }
            });
    }]);

app.factory('Resources', ['$resource', function($resource){
    function getResource(resourceName){
        var resourceOptions = { 'get':    {method:'GET'},
                                'save':   {method:'POST'},
                                'query':  {method:'GET', isArray:true},
                                'remove': {method:'DELETE'},
                                'delete': {method:'DELETE'} };
        switch(resourceName){
            case "tasks":
            default:
                return $resource('/task-tracker/' + resourceName + '/:filter');
        }
    }

    return { getResource: getResource };
    
}]);

app.factory('Time', [function(){
    function getTimezone(){
        
    }
}]);

app.factory("Security", ['$http','$q', '$localStorage', function($http, $q, $localStorage){
    function signup(email, password, first_name, last_name){
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/task-tracker/signup',
            data: { email: email, password: password, first_name: first_name, last_name: last_name }
        }).then(function success(response){
            return response;
        }, function error(response){
            return response;
        });
    }

    function loginWithToken(token){
        var deferred = $q.defer();
        if (!token){ deferred.reject("Token is null."); return deferred.promise; }
        $localStorage.token = token;
        $http.defaults.headers.common["Authorization"] = "Bearer " + $localStorage.token;
        deferred.resolve($localStorage.token);
        return deferred.promise;        
    }

    function login(email, password){        
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/task-tracker/login',
            data: { email: email, password: password}
        }).then(function successCallback(response) {
            return loginWithToken(response.data.token);            
        }, function errorCallback(response) {
            if (!response.data){ return "Could not get response from login database."; }            
            return response.data.error;
        });        
    }

    function logout(){
        $localStorage.token = null;
        $http.defaults.headers.common["Authorization"] = null;
    }

    function isUserAuthenticated(){
        return getToken()
        .then(function(token) {
            return $http({
                method: 'POST',
                url: 'http://localhost:3000/task-tracker/verifytoken'                
            }).then(function(response){             
                return true;
            }, function(error){
                return $q.reject(error);                
            });
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
        if (!$localStorage.token){ deferred.reject("Token not set."); return deferred.promise; }        
        $http.defaults.headers.common["Authorization"] = "Bearer " + $localStorage.token;
        deferred.resolve($localStorage.token);
        return deferred.promise; 
    }
    return { 
        signup: signup,
        login: login, 
        logout: logout,
        getToken: getToken, 
        isUserAuthenticated: isUserAuthenticated,
        authenticate: authenticate
    };
}]);

app.run(['$rootScope', '$location', '$state', '$anchorScroll', 'Security',
    function($rootScope, $location, $state, $anchorScroll, Security){
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){            
            //to prevent infinite loops
            if (toState.shouldNotRetry){
                toState.shouldNotRetry = false;
                return;
            }
            event.preventDefault();
            Security.isUserAuthenticated().then(function(userIsAuthenicated){                               
                toState.shouldNotRetry = true;
                $state.go(toState);
            }, function(error){
                $state.go('login');
            });
        });    
    }
]);    