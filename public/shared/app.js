var app = angular.module('tasks', ['ui.router', 'ui.router.title', 'ngSanitize', 'ngResource', 'ui.bootstrap', 'mwl.calendar', 'oc.lazyLoad', 'chart.js', 'ngStorage']);

app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$resourceProvider",
    function($stateProvider, $urlRouterProvider, $locationProvider, $resourceProvider){
        $urlRouterProvider.otherwise("/tasks/todo/");
        $resourceProvider.defaults.stripTrailingSlashes = false;        
        $locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state("todo", {
                url: '/tasks/todo/',                
                controller: 'TasksController',                        
                templateUrl: '../tasks/tasks.html',
                params: { 
                    filter: { is_complete: false }, 
                    orderBy: ['due_date', 'asc']
                },
                resolve: { loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) { return $ocLazyLoad.load('../tasks/tasks.controller.js'); }] }                                                                                                    
            }).state("login", {
                url: '/login/',
                controller: 'LoginController',
                templateUrl: '../login/login.html',
                params: { continueState: null }, 
                allowAnonymous: true,
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../login/login.controller.js');
                    }]
                }
            }).state("signup", {
                url: '/signup/',
                controller: 'SignupController',
                templateUrl: '../signup/signup.html',
                allowAnonymous: true,
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../signup/signup.controller.js');
                    }]
                }
            }).state("confirm-signup", {
                url: '/confirm-signup/:signupId/',
                controller: 'ConfirmSignupController',
                templateUrl: '../confirm-signup/confirm-signup.html',
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../confirm-signup/confirm-signup.controller.js');
                    }]
                }
            }).state("tasks", {
                url: '/tasks/all',
                controller: "TasksController",    
                templateUrl: '../tasks/tasks.html',                                      
                resolve: { 
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../tasks/tasks.controller.js');
                    }]
                }              
            }).state("completedTasks", {
                url: '/tasks/completed/',
                controller: "TasksController",    
                templateUrl: '../tasks/tasks.html',
                params: { 
                    filter: { is_complete: true },
                    orderBy: ['due_date', 'desc'],
                    areAddTaskButtonsHidden: true
                },                                      
                resolve: { loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) { return $ocLazyLoad.load('../tasks/tasks.controller.js'); }] }              
            }).state('taskCalendar', {
                url: '/tasks/calendar/',
                controller: 'TaskCalendarController',
                templateUrl: '../task-calendar/task-calendar.html',
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../task-calendar/task-calendar.controller.js');
                    }]
                }
            }).state('addTask', {
                url: '/tasks/add/',
                controller: 'TaskDetailController',
                templateUrl: '../task-detail/task-detail.html',  
                params: {task: {}, formMode: 'add'},                                                         
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../task-detail/task-detail.controller.js');
                    }]
                }
            }).state('editTask', {
                url: '/tasks/:taskId/', 
                controller: 'TaskDetailController',               
                templateUrl: '../task-detail/task-detail.html',  
                params: {formMode: 'edit'},                                                         
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {                      
                        return $ocLazyLoad.load('../task-detail/task-detail.controller.js');
                    }]
                }
            });
    }]);

app.factory('apiHost', ['$location', function($location){
    if ($location.host().indexOf('localhost') > -1){ return 'http://localhost:3000'; }
    return 'http://api.rjfreund.com';
}]);

app.factory('DatetimeFormatter', [function(){
    return {
        toUTC: function(object, properties){
            var returnObject = angular.copy(object);
            for (var i = 0; i < properties.length; i++){ 
                if (!returnObject.hasOwnProperty(properties[i])){ continue; }
                if (returnObject[properties[i]] === null){ continue; }
                returnObject[properties[i]] = moment.utc(returnObject[properties[i]]).format();
            }            
            return returnObject;
        },
        toLocal: function(object, properties){
            var returnObject = angular.copy(object);
            for (var i = 0; i < properties.length; i++){ 
                if (!returnObject.hasOwnProperty(properties[i])){ continue; }
                if (returnObject[properties[i]] === null){ continue; }
                returnObject[properties[i]] = new Date(moment(returnObject[properties[i]]).format('MM/DD/YYYY hh:mm a'));
            }            
            return returnObject;
        }
    };
}]);

app.factory('CategoryManager', ['$q', 'apiHost', 'DatetimeFormatter', '$http', function($q, apiHost, DatetimeFormatter, $http){
    return {
        getCategories: function(filter, orderBy){ 
            var options = {
              method: 'GET',
              url: apiHost + '/task-tracker/categories/',
              params: {}
            };
            if (filter){ options.params.filter = filter; }
            if (orderBy){ options.params.orderBy = orderBy; }
            return $http(options);
        }
    };
}]);

app.factory('TaskManager', ['$q', 'apiHost', 'DatetimeFormatter', '$http', function($q, apiHost, DatetimeFormatter, $http){
    return {
        getSingleTask: function(taskId){ return $http({method: "GET", url: apiHost + "/task-tracker/tasks/", params: { filter: {id: taskId} } }) },
        getTasks: function(filter, orderBy){ 
            var options = {
              method: 'GET',
              url: apiHost + '/task-tracker/tasks/',
              params: {}
            };
            if (filter){ options.params.filter = filter; }
            if (orderBy){ options.params.orderBy = orderBy; }
            return $http(options);
        },
        setCompletionDate: function(task){ 
            if (!task.is_complete){ task.completion_date = null; return; }
            task.completion_date = new Date(moment().format('MM/DD/YYYY hh:mm a'));
        },
        setAssignedDateToToday: function(task){ task.assigned_date = new Date(moment().format('MM/DD/YYYY hh:mm a')); },
        saveEdit: function(task){
            return $http({
                method: "PUT",
                url: apiHost + "/task-tracker/tasks/" + task.id,
                data: DatetimeFormatter.toUTC(task, ['creation_date', 'modified_date', 'assigned_date', 'due_date', 'completion_date'])
            });
        },
        saveAdd: function(task){
            return $http({
                method: "POST",
                url: apiHost + "/task-tracker/tasks",
                data: DatetimeFormatter.toUTC(task, ['creation_date', 'modified_date', 'assigned_date', 'due_date', 'completion_date'])
            });
        },
        deleteTask: function(task){ return $http({ method: 'DELETE', url: apiHost + '/task-tracker/tasks/' + task.id }); }
    };
}]);

app.factory("Security", ['$http','$q', '$localStorage', 'apiHost', function($http, $q, $localStorage, apiHost){
    function signup(email, password, first_name, last_name){
        return $http({
            method: 'POST',
            url:  apiHost + '/task-tracker/signup',
            data: { email: email, password: password, first_name: first_name, last_name: last_name }
        }).then(function success(response){
            return response;
        }, function error(response){
            return response;
        });
    }

    function loginWithToken(token){
        var deferred = $q.defer();
        if (!token){ deferred.reject("Token is null."); return deferred.promise; }
        $localStorage.token = token;
        $http.defaults.headers.common["Authorization"] = "Bearer " + $localStorage.token;
        deferred.resolve($localStorage.token);
        return deferred.promise;        
    }

    function login(email, password){  
        console.log('Security.login()');      
        return $http({
            method: 'POST',
            url: apiHost + '/task-tracker/login',
            data: { email: email, password: password}
        }).then(function successCallback(response) {
            return loginWithToken(response.data.token);            
        }, function errorCallback(response) {
            return $q.reject(response);  
        });        
    }

    function logout(){
        $localStorage.token = null;
        $http.defaults.headers.common["Authorization"] = null;
    }

    function isUserAuthenticated(){
        return getToken()
        .then(function(token) {
            return $http({
                method: 'POST',
                url: apiHost + '/task-tracker/verifytoken'                
            }).then(function(response){             
                return true;
            }, function(error){
                return $q.reject(error);                
            });
        });
    }

    function authenticate(){
        return isUserLoggedIn().then(function(userIsLoggedIn){
            return userIsLoggedIn
        }, function(userIsNotLoggedIn){
            return $q.reject(userIsNotLoggedIn);
        });
    }

    function getToken(){ 
        var deferred = $q.defer();
        deferred.notify("About to get user token.");
        if (!$localStorage.token){ deferred.reject("Token not set."); return deferred.promise; }        
        $http.defaults.headers.common["Authorization"] = "Bearer " + $localStorage.token;
        deferred.resolve($localStorage.token);
        return deferred.promise; 
    }
    return { 
        signup: signup,
        login: login, 
        logout: logout,
        getToken: getToken, 
        isUserAuthenticated: isUserAuthenticated,
        authenticate: authenticate
    };
}]);

app.factory('PrevState', ['$state', function($state){
    var fromState;
    var fromParams;
    return {
        set: function(input_fromState, input_fromParams){ fromState = input_fromState; fromParams = input_fromParams },
        go: function(){ 
            if (angular.isUndefined(fromState)){ $state.go('todo'); return; }
            $state.go(fromState, fromParams); 
        }
    };
}]);

app.factory('NavBarManager', [function(){ return { showNavBar: false }; }]);

app.run(['$rootScope', '$location', '$state', '$anchorScroll', 'Security', 'PrevState', 'NavBarManager',
    function($rootScope, $location, $state, $anchorScroll, Security, PrevState, NavBarManager){
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){            
            //to prevent infinite loops
            if (toState.shouldNotRetry){ toState.shouldNotRetry = false; return; }
            event.preventDefault();
            Security.isUserAuthenticated().then(function(userIsAuthenicated){                               
                toState.shouldNotRetry = true;                
                if (fromState.name !== ""){ PrevState.set(fromState.name, fromParams); }
                $state.go(toState, toParams);
            }, function(error){
                if (fromState.name !== ""){ PrevState.set(fromState.name, fromParams); }  
                toState.shouldNotRetry = true;  
                $state.go('login');
            });
        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
            if (toState.allowAnonymous){ NavBarManager.showNavBar = false; return; }
            NavBarManager.showNavBar = true;
        });    
    }
]);    