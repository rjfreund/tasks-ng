var app = angular.module("tasks");
app.controller("DynamicTemplateListController", ['$scope', '$http', 'apiHost', 'StringHelper', function($scope, $http, apiHost, StringHelper){

    $scope.entity = {};
    $scope.entity.name = "tasks"; //TODO: have to get this dynamically from url or somewhere somehow
    $scope.entity.attributes = [];
    $scope.allowedColumns = [];
    var options = {
        method: 'GET',
        url: apiHost + '/task-tracker/' + $scope.entity.name + '/describe',
        params: {}
    };
    $scope.getEntityDescription = $http(options).then(function(res){
        var attributes = res.data;
        for (var attribute in attributes){
            if (attributes.hasOwnProperty(attribute)){ $scope.entity.attributes.push(attribute); }
        }
    }).then(function(){
        $scope.allowedColumns = getAllowedColumns($scope.entity);
    });

    function getAllowedColumns(entity){ //TODO: need to put this somewhere organized
        var allowedColumns = [];
        var defaultColumns = ["name", "assigned_date", "due_date"];
        for (var i = 0; i < defaultColumns.length; ++i){
            if (allowedColumns.length >= 4){ break; }
            if (entity.attributes.indexOf(defaultColumns[i]) === -1){ continue; }
            allowedColumns.push(StringHelper.humanize(defaultColumns[i]));
            if (defaultColumns[i] !== "due_date"){ continue; }
            allowedColumns.push(StringHelper.humanize("days_left"));
        }
        return allowedColumns;
    }
}]);

/*
app.directive('dynAttr', ['apiHost', '$http', function(apiHost, $http) {
    return {
        restrict: 'A',
        scope: {
            entity: "=",
            getEntityDescription: "&"
        },
        controller: 'DynamicTemplateController',
        link: function(scope, elem, attrs){
            scope.getEntityDescription.then(function(){
                var index = scope.$eval(attrs.index);
                elem.html(scope.entity.attributes[index]);
            });
        }
    };
}]);
*/