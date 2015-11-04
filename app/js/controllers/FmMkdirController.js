angular.module('mro').controller('FmMkdirController', function($scope, FmService) {
	$scope.mkdir = function(name) {
		if(!name) {
			return;
		}
		FmService.mkdir($scope.path + name).then(function(resp) {
			if(resp.status == 'ok') {
				$scope.$parent.refresh();
				$scope.closeThisDialog();
			} else {
				$scope.mkdirError = resp.message;
			}
		});
	};
});