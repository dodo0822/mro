angular.module('mro').controller('JobSubmitController', function($scope, JobService) {
	$scope.submit = function(job) {
		JobService.submit(job.input, job.output, job.mapper, job.reducer, job.cluster).then(function(resp) {
			$scope.$parent.init();
			$scope.closeThisDialog();
		});
	};
});