var app = angular.module("tasks");

app.directive('navbar', ['$state', 'Security', function($state, Security){
  return {    
  	templateUrl: '../navbar/navbar.html',
  	link: function link(scope, element, attrs) {
  		scope.collapseNav = true;
  		scope.logout = function(){ Security.logout(); $state.go('login'); };
  		scope.toggleNav = function(){ scope.collapseNav = !scope.collapseNav; };  		
  		scope.isActive = function(stateName){ return stateName === $state.current.name; };  		
  	}
  };
}]);