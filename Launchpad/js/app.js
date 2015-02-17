
var launchpad = angular.module('launchpad',['ngRoute','ngResource','ngCookies','ngAnimate']);


var instance = 'launchpad';
var API_URL = 'http://api.gocatalyze.com';
var API_PORT = '80';
var header = {"Content-Type":"application.json"};
var API_KEY = 'b418e83e-79aa-4732-9b87-6cc8026dca85';

launchpad.value('Session', {
    pid: '',
    uid:'',
    api_key:''
});

launchpad.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'views/browse-by-name.html',
		controller:'HomeController'
	})
	.when('/users/login',{
		templateUrl:'views/login.html',
		controller:'LoginController'
	})
	.when('/users/signup',{
		templateUrl:'views/user-register.html',
		controller:'SignupController'
	})
	.when('/profile',{
		templateUrl:'views/profile.html',
		controller:'ProfileController'
	})
	.when('/edit-profile',{
		templateUrl:'views/edit-profile.html',
		controller:'EditProfileController',
	})
	.when('/logout',{
		templateUrl:'views/header.html',
		controller:'LogoutController',
	})
	.when('/tags',{
		templateUrl:'views/browse-by-experience.html',
		controller:'ExpController'
	})
	.when('/forgot-password',{
		templateUrl:'views/forgot-password.html',
		controller:'ForgotPasswordController',
	})
	.when('/user/:pid/contact',{
		templateUrl:'views/contact.html',
		controller:'ContactController'
	})
	.when('/user/:uid',{
		templateUrl:'views/user-detail.html',
		controller:'UserDetailController'
	})
	.when('/tags/:tid',{
		templateUrl : 'views/category-detail.html',
		controller : 'CategoryDetailController'
	})
	.when('/:char',{
		templateUrl : 'views/user-by-name.html',
		controller : 'UserByNameController'
	})
	.otherwise({
		redirectTo:'/'
	});

})

