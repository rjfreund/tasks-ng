var app = angular.module("tasks");

app.controller("DeleteConfirmController", ['$scope', 'task', '$uibModalInstance', 'TaskManager',
function($scope, task, $uibModalInstance, TaskManager){
	$scope.delete = function(){
		TaskManager.deleteTask(task)
		.then(function(response){
			$uibModalInstance.close({action:'delete'});
		}, function(response){
			$uibModalInstance.dismiss({action: 'error', message: response});
		});
	}
	$scope.cancel = function(){ $uibModalInstance.close({action:'cancel'});	};
}]);