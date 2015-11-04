angular.module('mro').controller('RegisterController', function($scope, $state, UserService) {
	$scope.register = function(user) {
		if(!user) {
			$scope.error = 'All fields must be filled.';
			return false;
		}
		if(!user.username || !user.password || !user.passwordRepeat || !user.email) {
			$scope.error = 'All fields must be filled.';
			return false;
		}
		if(user.password != user.passwordRepeat) {
			$scope.error = 'Password does not match.';
			return false;
		}
		UserService.register(user.username, user.password, user.email).then(function(resp) {
			if(resp.status == 'error') {
				$scope.error = resp.message;
				return false;
			}
			$state.go('login');
		});
	};
});