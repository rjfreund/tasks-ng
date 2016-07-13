var app = angular.module('tasks', ['ui.router', 'ui.router.title', 'ngSanitize', 'ngResource', 'ui.bootstrap', 'oc.lazyLoad']);

app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$resourceProvider",
    function($stateProvider, $urlRouterProvider, $locationProvider, $resourceProvider){
        $urlRouterProvider.otherwise("/");
        $resourceProvider.defaults.stripTrailingSlashes = false;        
        $locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state("home", {
                url: '/home/',
                templateUrl: '../home/home.html'                
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

app.factory("Session", function(){

});

app.run(['$rootScope', '$location', '$state', '$anchorScroll',
    function($rootScope, $location, $state, $anchorScroll){
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                //make sure that the user is logged in
                // if (!isUserLoggedIn) {
                //		redirectToLoginPage();
                //}
            });
    }]);