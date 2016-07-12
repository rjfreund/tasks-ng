var app = angular.module('tasks', ['ui.router', 'ui.router.title', 'ngSanitize', 'ngResource', 'ui.bootstrap']);
app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/")
	$stateProvider
		.state("home", {
            url: '/',
            templateUrl: '../home/home.html'
        })
		.state("login", {});
});

app.factory("Session", function(){

});

app.run(['$rootScope', '$location', '$state', 'constructionService', '$anchorScroll',
    function($rootScope, $location, $state, constructionService, $anchorScroll){
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
            	//make sure that the user is logged in
            	/* if (!isUserLoggedIn) {
					redirectToLoginPage();
            	}
				*/
            });        
}]);