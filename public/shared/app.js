var tasksApp = angular.module('tasks', ['ui.router', 'ui.router.title', 'ngSanitize', 'ngResource', 'ui.bootstrap']);
tasksApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/")
	$stateProvider
		.state("home", {});
});