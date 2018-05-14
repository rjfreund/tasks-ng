var app = angular.module("tasks");
app.controller("DynamicTemplateController", ['$scope', '$state', 'Security', '$http', '$q', 'apiHost', function($scope, $state, Security, $http, $q, apiHost){

    $scope.entity = {};
    $scope.entity.attributes = [];
    $scope.httpResult = null;
    var options = {
        method: 'GET',
        url: apiHost + '/task-tracker/tasks/describe',
        params: {}
    };
    $scope.getEntityDescription = $http(options).then(function(res){
        var attributes = res.data;
        for (var attribute in attributes){
            $scope.entity.attributes.push(attribute);
        }
    });

}]);

app.directive('dynAttr', ['apiHost', '$http', function(apiHost, $http) {
    return {
        restrict: 'A',
        scope: {
            entity: "=",
            getEntityDescription: "&"
        },
        controller: 'DynamicTemplateController',
        link: function(scope, elem, attrs){
            //TODO: need to figure out how to made a grid for multiple entities
            scope.getEntityDescription.then(function(){
                var index = scope.$eval(attrs.index);
                elem.html(scope.entity.attributes[index]);
            });
        }
    };
}]);