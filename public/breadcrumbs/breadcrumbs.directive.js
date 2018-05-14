var app = angular.module('tasks');

app
/*
.controller('BreadcrumbsController' ['$scope', 'TaskManager', 
    function($scope, TaskManager){
        $scope.breadcrumbs = [];
        TaskManager.getSingleTask(taskId).then(function(res){
            $scope.breadcrumbs = res;
        });
}])
*/
.directive('breadcrumbs', ['TaskManager', '$stateParams', function(TaskManager, $stateParams){
    return {
        restrict: 'E',
        scope: {
            taskId: '='
        },
        controller: function($scope, $element, $attrs, $transclude){            
            $scope.parseFilterParams = function(){
                if ($stateParams.filter){
                    var filter;
                    if (angular.isString($stateParams.filter))
                    { 
                        filter = angular.fromJson($stateParams.filter);
                        angular.forEach(filter, function(value, key, i){ $stateParams[key] = value; });
                    } else { filter = $stateParams.filter; }                    
                }	
            }         
            $scope.getFilter = function(id){
                var filter = {};		
                if (angular.isString($stateParams.filter)){ filter = angular.fromJson($stateParams.filter); } 
                else { angular.copy($stateParams.filter, filter); }
                filter.parent_id = id;
                filter = JSON.stringify(filter);		
                return filter;		
            }   
            $scope.breadcrumbs = [];
            $scope.parseFilterParams();
            if (!$stateParams.parent_id){ return; }
            TaskManager.getTaskAncestors($stateParams.parent_id).then(function(res){
                if (!res){ return; }
                $scope.breadcrumbs = res;
            });
            
        },
        templateUrl: '/breadcrumbs/breadcrumbs.html'
    };
}]);