angular.module('mro').controller('FmController', function($scope, FmService, ngDialog) {
	$scope.list = [];
	$scope.path = '';

	$scope.openMkdirDialog = function() {
		var sc = $scope.$new(false);
		sc.path = $scope.path;
		ngDialog.open({
			template: 'views/fm-mkdir.html',
			className: 'ngdialog-theme-plain',
			controller: 'FmMkdirController',
			scope: sc
		});
	};

	$scope.openUploadDialog = function() {
		var sc = $scope.$new(false);
		sc.path = $scope.path;
		ngDialog.open({
			template: 'views/fm-upload.html',
			className: 'ngdialog-theme-plain ngdialog-large',
			controller: 'FmUploadController',
			scope: sc
		});
	};

	$scope.openRenameDialog = function(idx) {
		var sc = $scope.$new(false);
		sc.path = $scope.path;
		sc.name = $scope.list[idx].pathSuffix;
		ngDialog.open({
			template: 'views/fm-rename.html',
			className: 'ngdialog-theme-plain',
			controller: 'FmRenameController',
			scope: sc
		});
	};

	$scope.remove = function(idx) {
		var name = $scope.list[idx].pathSuffix;
		var sc = $scope.$new(false);
		sc.name = name;
		ngDialog.openConfirm({
			template: 'views/fm-delete.html',
			className: 'ngdialog-theme-plain',
			scope: sc
		}).then(function() {
			FmService.remove($scope.path + name).then(function(resp) {
				if(resp.status == 'ok') {
					$scope.refresh();
				}
			});
		});
	};

	$scope.refresh = function() {
		FmService.list($scope.path).then(function(resp) {
			if(resp.status == 'ok') {
				$scope.list = resp.list;
			}
		});
	};

	$scope.navigate = function(idx) {
		var name = $scope.list[idx].pathSuffix;
		var type = $scope.list[idx].type;
		if(type == 'DIRECTORY') {
			$scope.path += name + '/';
			FmService.list($scope.path).then(function(resp) {
				if(resp.status == 'ok') {
					$scope.list = resp.list;
				}
			});
		} else {
			FmService.read($scope.path + name).then(function(resp) {
				if(resp.status == 'ok') {
					var sc = $scope.$new(true);
					sc.content = resp.content;
					ngDialog.open({
						template: '/views/fm-file.html',
						className: 'ngdialog-theme-plain',
						scope: sc
					});
				}
			});
		}
	};

	$scope.up = function() {
		if($scope.path == '') return;
		var npath = '';
		var arr = $scope.path.split('/');
		for(var i = 0; i < arr.length-2; i++) {
			npath += arr[i];
			npath += '/';
		}
		$scope.path = npath;
		FmService.list($scope.path).then(function(resp) {
			if(resp.status == 'ok') {
				$scope.list = resp.list;
			}
		});
	};

	FmService.list('').then(function(resp) {
		if(resp.status == 'ok') {
			$scope.list = resp.list;
		}
	});
});