var app = angular.module("tasks");
app.controller('TaskReminderDetailController',
['$scope', '$stateParams', 'apiHost', '$http', 'PrevState',
function($scope, $stateParams, apiHost, $http, PrevState){
    $scope.taskReminder = {};
    if ($stateParams.formMode === 'edit' || $stateParams.formMode === 'view'){
        getTaskReminder($stateParams.taskId)
        .then(function success(res){
            $scope.taskReminder = res.data[0];
            console.log("taskReminder: ", $scope.taskReminder);
        }, function fail(res){
            console.error(res);
        });
    }
    $scope.formMode = $stateParams.formMode;
    $scope.save = function(){
        if ($scope.formMode === 'edit'){
            saveEdit($scope.taskReminder)
            .then(function success(res){
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
                PrevState.go();
            }, function fail(res){
                console.error(res);
            });
            return;
        }
        if ($scope.formMode === 'add'){
            saveAdd($scope.taskReminder)
            .then(function success(response){
                $scope.form.$setPristine();
                $scope.form.$setUntouched();
                $scope.taskReminder = {};
                PrevState.go();
            }, function error(response){
                console.error(response);
            });
            return;
        }
    };
    $scope.cancel = function(){ PrevState.go(); };

    function getTaskReminder(taskId){ return $http({method: "GET", url: apiHost + "/task-tracker/task_reminders/", params: { filter: {id: taskId} } }); }
    function saveEdit(taskReminder){
        return $http({
            method: "PUT",
            url: apiHost + "/task-tracker/tasks_reminders/" + taskReminder.id,
            data: taskReminder
        });
    }
    function saveAdd(taskReminder){
        return $http({
            method: "POST",
            url: apiHost + "/task-tracker/task_reminders",
            data: taskReminder
        });
    }
}]);
