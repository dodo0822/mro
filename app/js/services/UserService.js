angular.module('mro').service('UserService', function(AUTH_EVENTS, $http, $q, $rootScope, Session, $localStorage) {
	var userService = {
		register: function(username, password, email) {
			var promise = $http.post('/api/user/register', {
				username: username,
				password: password,
				email: email
			}).then(function(resp) {
				return resp.data;
			});
			return promise;
		},

		login: function(username, password) {
			var promise = $http.post('/api/user/login', {
				username: username,
				password: password
			}).then(function(resp) {
				return resp.data;
			});
			return promise;
		},

		restore: function(token) {
			var promise = $http.get('/api/user/profile', { params: {
				token: token
			} }).then(function(resp) {
				return resp.data;
			}, function(resp) {
				return resp.data;
			});
			return promise;
		},

		isAuthenticated: function() {
			return !!Session.userId;
		},

		checkAuth: function() {
			var deferred = $q.defer();
			if(userService.isAuthenticated()) {
				deferred.resolve();
			} else if($localStorage.token) {
				userService.restore($localStorage.token).then(function(resp) {
					if(resp.status == 'error') {
						delete $localStorage.token;
						deferred.reject({ type: 'redirect', location: 'login', message: resp.message });
						return;
					}
					$rootScope.$broadcast(AUTH_EVENTS.restoreSuccess, resp.user);
					Session.create($localStorage.token, resp.user._id);
					deferred.resolve();
				});
			} else {
				deferred.reject({ type: 'redirect', location: 'login', message: 'Please log in.' });
			}
			return deferred.promise;
		}
	};
	return userService;
});