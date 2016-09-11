var app = angular.module("tasks");

app.controller("DeleteConfirmController", ['$scope', 'task', '$uibModalInstance', 'TaskActions',
function($scope, task, $uibModalInstance, TaskActions){
	$scope.delete = function(){
		TaskActions.deleteTask(task)
		.then(function(response){
			$uibModalInstance.close({action:'delete'});
		}, function(response){
			$uibModalInstance.dismiss({action: 'error', message: response});
		});
	}
	$scope.cancel = function(){
		$uibModalInstance.close({action:'cancel'});
	};
}]);