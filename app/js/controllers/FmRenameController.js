angular.module('mro').controller('FmRenameController', function($scope, FmService) {
	$scope.origin = $scope.name;

	$scope.rename = function(name) {
		if(!name) {
			return;
		}
		FmService.rename($scope.path + $scope.origin, $scope.path + name).then(function(resp) {
			if(resp.status == 'ok') {
				$scope.$parent.refresh();
				$scope.closeThisDialog();
			} else {
				$scope.renameError = resp.message;
			}
		});
	};
});