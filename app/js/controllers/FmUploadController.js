angular.module('mro').controller('FmUploadController', function($scope, FmService, FileUploader, Session) {
	$scope.uploader = new FileUploader({
		url: '/api/fm/upload',
		formData: [
			{
				path: $scope.path,
				token: Session.token
			}
		]
	});
	$scope.uploader.onCompleteAll = function() {
		$scope.$parent.refresh();
		$scope.closeThisDialog();
	}
});