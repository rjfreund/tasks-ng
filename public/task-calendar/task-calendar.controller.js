var app = angular.module('tasks');

app.controller("TaskCalendarController", ['$scope', '$http', 'TaskActions', '$state', 
function($scope, $http, TaskActions, $state){
	$scope.calendarView = 'month';
	$scope.hasCalendarBeenLoaded =false;
	$scope.viewDate = new Date();
	$scope.events34 = [
		{
			title: 'My event title', // The title of the event
			startsAt: new Date(), // A javascript date object for when the event starts
			endsAt: new Date(), // Optional - a javascript date object for when the event ends
			color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
			  primary: '#e3bc08', // the primary event color (should be darker than secondary)
			  secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
			},
			actions: [{ // an array of actions that will be displayed next to the event title
				label: '<i class=\'glyphicon glyphicon-pencil\'></i>', // the label of the action
				cssClass: 'edit-action', // a CSS class that will be added to the action element so you can implement custom styling
				onClick: function(args) { // the action that occurs when it is clicked. The first argument will be an object containing the parent event
				console.log('Edit event', args.calendarEvent);
				}
			}],
			draggable: true, //Allow an event to be dragged and dropped
			resizable: true, //Allow an event to be resizable
			incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
			recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
			cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
			allDay: false // set to true to display the event as an all day event on the day view
		}
	];
	$scope.events = [];
	$scope.getEvents = function(){ 		
		TaskActions.getTasks({is_complete: false})
		.then(function success(response){			
			$scope.events = response.data.map(function(task){
				return {
					title: task.name, // The title of the event
					startsAt: new Date(task.assigned_date), // A javascript date object for when the event starts
					endsAt: new Date(task.due_date), // Optional - a javascript date object for when the event ends
					color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
					  primary: '#e3bc08', // the primary event color (should be darker than secondary)
					  secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
					},
					actions: [{ // an array of actions that will be displayed next to the event title
						label: '<i class=\'glyphicon glyphicon-pencil\'></i>', // the label of the action
						cssClass: 'edit-action', // a CSS class that will be added to the action element so you can implement custom styling
						onClick: function(args) { // the action that occurs when it is clicked. The first argument will be an object containing the parent event
							$state.go('editTask',{taskId: task.id});
						}
					}],
					draggable: true, //Allow an event to be dragged and dropped
					resizable: true, //Allow an event to be resizable
					incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
					//recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
					//cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
					allDay: false, // set to true to display the event as an all day event on the day view
					taskId: task.id
				};
			});
			$scope.hasCalendarBeenLoaded = true;
		}, function error(response){			
			console.error(response);
		});
	};
	$scope.eventClicked = function(event){ $state.go('editTask',{taskId: event.taskId}); };
	$scope.getEvents();
}]);