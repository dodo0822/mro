angular.module('mro').service('FmService', function($http, Session) {
	return {
		list: function(path) {
			return $http.get('/api/fm/list', { params: {
				token: Session.token,
				path: path
			} }).then(function(resp) {
				return resp.data;
			});
		},

		read: function(name) {
			return $http.get('/api/fm/read', { params: {
				token: Session.token,
				name: name
			} }).then(function(resp) {
				return resp.data;
			});
		},

		mkdir: function(name) {
			return $http.get('/api/fm/mkdir', { params: {
				token: Session.token,
				name: name
			} }).then(function(resp) {
				return resp.data;
			});
		},

		remove: function(path) {
			return $http.get('/api/fm/remove', { params: {
				token: Session.token,
				path: path
			} }).then(function(resp) {
				return resp.data;
			});
		},

		rename: function(orig, aft) {
			return $http.get('/api/fm/rename', { params: {
				token: Session.token,
				origin: orig,
				after: aft
			} }).then(function(resp) {
				return resp.data;
			});
		}
	};
});