angular.module('mro').controller('HomeController', function($scope, ngDialog, JobService) {
	$scope.jobs = [];

	$scope.openSubmitDialog = function() {
		var sc = $scope.$new(false);
		ngDialog.open({
			template: 'views/job-submit.html',
			controller: 'JobSubmitController',
			className: 'ngdialog-theme-plain ngdialog-large',
			scope: sc
		});
	};

	$scope.remove = function(idx) {
		JobService.remove($scope.jobs[idx]._id).then(function(resp) {
			if(resp.status == 'ok') {
				$scope.init();
			}
		});
	};

	$scope.viewOutput = function(idx) {
		JobService.output($scope.jobs[idx]._id).then(function(resp) {
			if(resp.status == 'ok') {
				var sc = $scope.$new(true);
				sc.stdout = resp.output.stdout;
				sc.stderr = resp.output.stderr;
				ngDialog.open({
					template: 'views/job-output.html',
					className: 'ngdialog-theme-plain ngdialog-large',
					scope: sc
				});
			}
		});
	};

	$scope.init = function() {
		JobService.list().then(function(resp) {
			if(resp.status == 'ok') {
				$scope.jobs = resp.list;
			}
		});
	};

	$scope.init();
});