var app = angular.module("tasks");
app.controller("TaskRemindersController",
['$scope', '$state', '$http', '$q', 'apiHost', '$stateParams', 'TaskManager', '$uibModal',
function($scope, $state, $http, $q, apiHost, $stateParams, TaskManager, $uibModal){
    $scope.taskReminders = [];
    $scope.haveTaskRemindersBeenLoaded = false;
    $scope.getTaskReminders = function(){
        var options = {
            method: 'GET',
            url: apiHost + '/task-tracker/task_reminders/',
            params: {}
        };
        if ($stateParams.filter){ options.params.filter = $stateParams.filter; }
        if ($stateParams.orderBy){ options.params.orderBy = $stateParams.orderBy; }
        $http(options)
        .then(function success(response){
            $scope.taskReminders = response.data;
            $scope.haveTaskRemindersBeenLoaded = true;
        }, function error(response){
            console.error(response);
        });
    };
    $scope.delete = function(taskReminder){
        var modalInstance = $uibModal.open({
            templateUrl: '../delete-confirm/delete-confirm.html',
            controller: 'DeleteConfirmController',
            size: "sm",
            resolve: { loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) { return $ocLazyLoad.load('../delete-confirm/delete-confirm.controller.js'); }] }
        });
        modalInstance.result
        .then(function success(response) {
            if (response.action !== 'delete') { return modalInstance.close(); }
            return $http({ method: 'DELETE', url: apiHost + '/task-tracker/task_reminders/' + taskReminder.id })
            .then(function (result) { return $scope.getTasks(); })
            .then(function (result) { return modalInstance.close(); });
        }).catch(function (err) {
            console.error(err.message);
        });
    };
    $scope.getTaskReminders();
}]);
