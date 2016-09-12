var app = angular.module("tasks");

app.directive('navbar', ['$state', 'Security', 'NavBarManager', function($state, Security, NavBarManager){
  return {    
  	templateUrl: '../navbar/navbar.html',
  	link: function link(scope, element, attrs) {
  		scope.collapseNav = true;
  		scope.logout = function(){ Security.logout(); $state.go('login'); };
  		scope.toggleNav = function(){ scope.collapseNav = !scope.collapseNav; };  		
  		scope.isActive = function(stateName){ return stateName === $state.current.name; };
  		scope.showNavBar = NavBarManager.showNavBar;  	  		
      scope.$watch(function(){
	      return NavBarManager.showNavBar;
  		}, function(NewValue, OldValue){
		    scope.showNavBar = NavBarManager.showNavBar;
  		});    
  	}
  };
}]);