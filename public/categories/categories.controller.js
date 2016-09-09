var app = angular.module('tasks');
app.controller('CategoriesController', ['$scope', function($scope){
	$scope.categories = [];
	$scope.getCategories = CategoryManager.getCategories().then(function(response){ $scope.categories = response; });
}]);