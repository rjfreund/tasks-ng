var app = angular.module("tasks");
app.controller("TasksController", 
['$scope', '$state', '$http', '$q', '$state', 'apiHost', '$stateParams', 'TaskActions', '$uibModal',
function($scope, $state, $http, $q, $state, apiHost, $stateParams, TaskActions, $uibModal){	
	$scope.tasks = [];
	$scope.haveTasksBeenLoaded = false;
	$scope.quickAddTask = {};
	$scope.completeTask = function(task){ 
		task.is_complete = true; 
		TaskActions.setCompletionDate(task);
		TaskActions.saveEdit(task).then(function success(res){ $scope.getTasks(); }, function fail(res){ console.error(res); });		
	};
	$scope.areAddTaskButtonsHidden = function(){ if($stateParams.areAddTaskButtonsHidden){ return $stateParams.areAddTaskButtonsHidden; } return false; };	
	$scope.getDaysLeft = function(task){ if(moment(task.due_date).isValid()){ return moment(task.due_date).diff(moment(), 'days'); } };
	$scope.getTasks = function(){
		TaskActions.getTasks($stateParams.filter, $stateParams.orderBy)
		.then(function success(response){			
			$scope.tasks = response.data;
			$scope.haveTasksBeenLoaded = true;
		}, function error(response){			
			console.error(response);
		});
	};	
	$scope.quickAddTaskSubmit = function(form){
		console.log($scope.quickAddTask);
		$http({
			method: "POST",
			url: apiHost + "/task-tracker/tasks",
			data: {
				name: $scope.quickAddTask.name,
				assigned_date: moment.utc().format(), //TODO: get date.now as utc
				due_date: moment.utc().format()
			}
		}).then(function success(response){
			form.$setPristine();
			form.$setUntouched();			
			$scope.quickAddTask = {};	    
			$scope.getTasks();
		}), function error(response){
			console.error(response);
		};
	};	
	$scope.delete = function(task){
		var modalInstance = $uibModal.open({	      
	      templateUrl: '../tasks/delete-confirm.html',
	      controller: 'DeleteConfirmController',	      
	      size: "sm",
	      resolve: { 
	      	task: function(){ return task },
	      	loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) { return $ocLazyLoad.load('../tasks/delete-confirm.controller.js'); }] 
	      } 
	    });		
	    console.log(modalInstance);
	    modalInstance.result.then(function success(response){	    	
	    	if (response.action === 'delete'){ $scope.getTasks(); return };	    		    
	    	if (response.action === 'cancel'){ /* do nothing */ return; }	
	    }, function fail(response){
	    	if (response.action === 'error'){ console.error(response.message); return; }	    	
	    });
	};
	$scope.collapseQuickAdd = true;
	$scope.toggleQuickAdd = function(){ $scope.collapseQuickAdd = !$scope.collapseQuickAdd; };
	$scope.getTasks();
}])