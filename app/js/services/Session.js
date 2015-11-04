angular.module('mro').service('Session', function($localStorage){
	this.create = function(token, userId){
		this.token = token;
		this.userId = userId;
		$localStorage.token = token;
	};
	this.destroy = function(){
		this.token = null;
		this.userId = null;
		delete $localStorage.token;
	};
	return this;
});