var app = angular.module("tasks");
app.controller("TasksController", 
['$scope', '$state', '$http', '$q', 'apiHost', '$stateParams', 'TaskManager', '$uibModal',
function($scope, $state, $http, $q, apiHost, $stateParams, TaskManager, $uibModal){	
	$scope.filter = {};
	$scope.parseFilterParams = function(){
		if ($stateParams.filter){
			var filter;
			if (angular.isString($stateParams.filter)){ filter = angular.fromJson($stateParams.filter);
			} else { filter = $stateParams.filter; }
			angular.forEach(filter, function(value, key, i){ $stateParams[key] = value; });
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
	$scope.tasks = [];
	$scope.haveTaskRemindersBeenLoaded = false;
	$scope.quickAddTask = {};
	$scope.completeTask = function(task){ 
		task.is_complete = true; 
		TaskManager.setCompletionDate(task);
		TaskManager.saveEdit(task).then(function success(res){ $scope.getTasks(); }, function fail(res){ console.error(res); });
	};
	$scope.areAddTaskButtonsHidden = function(){ if($stateParams.areAddTaskButtonsHidden){ return $stateParams.areAddTaskButtonsHidden; } return false; };	
	$scope.getDaysLeft = function(task){ if(moment(task.due_date).isValid()){ return moment(task.due_date).diff(moment(), 'days'); } };
	$scope.getTasks = function(){
		TaskManager.getTasks($stateParams.filter, $stateParams.orderBy)
		.then(function success(tasks){			
			$scope.tasks = tasks;
			$scope.haveTaskRemindersBeenLoaded = true;
		}, function error(response){			
			console.error(response);
		});
	};	
	$scope.getBreadcrumbs = function(taskId){
		if (!taskId){ return; }		
		TaskManager.getTaskAncestors(taskId)
		.then(function success(ancestors){			
			$scope.breadcrumbs = ancestors.reverse();		
		}).catch(function error(response){
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
	      templateUrl: '../delete-confirm/delete-confirm.html',
	      controller: 'DeleteConfirmController',	      
	      size: "sm",
	      resolve: { loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) { return $ocLazyLoad.load('../delete-confirm/delete-confirm.controller.js'); }] }
	    });		
	    console.log(modalInstance);
	    modalInstance.result
		.then(function success(response) {
            if (response.action !== 'delete') { return modalInstance.close(); }
            return TaskManager.deleteTask(task)
			.then(function (result) { return $scope.getTasks(); })
			.then(function (result) { return modalInstance.close(); });
        }).catch(function (err) {
            console.error(err.message);
        });
	};
	$scope.collapseQuickAdd = true;
	$scope.toggleQuickAdd = function(){ $scope.collapseQuickAdd = !$scope.collapseQuickAdd; };
	$scope.parseFilterParams();
	$scope.getTasks();		
}])