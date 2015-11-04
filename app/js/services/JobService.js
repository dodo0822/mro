angular.module('mro').service('JobService', function($http, Session) {
	return {

		submit: function(input, output, mapper, reducer, cluster) {
			return $http.post('/api/job/submit', {
				mapper: mapper,
				reducer: reducer,
				input: input,
				output: output,
				cluster: cluster,
				token: Session.token
			}).then(function(resp) {
				return resp.data;
			});
		},

		list: function() {
			return $http.get('/api/job/list', { params: {
				token: Session.token
			} }).then(function(resp) {
				return resp.data;
			});
		},

		output: function(id) {
			return $http.get('/api/job/output', { params: {
				token: Session.token,
				_id: id
			} }).then(function(resp) {
				return resp.data;
			});
		},

		remove: function(id) {
			return $http.get('/api/job/remove', { params: {
				token: Session.token,
				_id: id
			} }).then(function(resp) {
				return resp.data;
			});
		}
		
	};
});