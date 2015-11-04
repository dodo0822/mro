angular.module('mro').config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	var checkAuth = function() {
		return {
			protected: [ 'UserService', '$q', function(UserService, $q) {
				return UserService.checkAuth();
			} ]
		};
	};

	$urlRouterProvider.otherwise(function($injector) {
		var $state = $injector.get('$state');
		$state.go('home');
	});
	$locationProvider.html5Mode(true);

	$stateProvider.state('home', {
		url: '/home',
		templateUrl: '/views/home.html',
		controller: 'HomeController',
		resolve: checkAuth()
	}).state('login', {
		url: '/login',
		templateUrl: '/views/login.html',
		controller: 'LoginController'
	}).state('register', {
		url: '/register',
		templateUrl: '/views/register.html',
		controller: 'RegisterController'
	}).state('fm', {
		url: '/fm',
		templateUrl: '/views/fm.html',
		controller: 'FmController',
		resolve: checkAuth()
	});

});

angular.module('mro').run(function($rootScope, $state) {
	$rootScope.$on('$stateChangeError', function(e, to, toParams, from, fromParams, error) {
		if(error.type === 'redirect') {
			$state.go(error.location);
		}
	});
});