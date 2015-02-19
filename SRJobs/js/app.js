/**
 * Config options for access the GoCatalyze API.
 *
 * Testing...
var API_URL = "http://localhost";
var API_PORT = "8888";
var API_INSTANCE = "sarina-dev";
 *
 */

var API_URL = "http://api.gocatalyze.com";
var API_PORT = "80";
var API_INSTANCE = "sarina-dev";
var FACEBOOK_APP_ID = '890628367620348';

var srJobs = angular.module('srJobs',['ng','ngRoute','ngTouch','ngFacebook','ngResource']);

srJobs.config(['$routeProvider','$facebookProvider','$httpProvider',
  function($routeProvider,$facebookProvider,$httpProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginController'
      }).
      when('/home', {
        templateUrl: 'views/jobseeker/home.html',
        controller: 'homeController'
      }).
      when('/createAccount', {
        templateUrl: 'views/create-account.html',
        controller: 'createAccountController'
      }).
      when('/forgotPassword', {
        templateUrl: 'views/forgot-password.html',
        controller: 'forgotPasswordController'
      }).
      when('/createProfile', {
        templateUrl: 'views/create-profile.html',
        controller: 'createProfileController'
      }).
      when('/editProfile', {
        templateUrl: 'views/jobseeker/edit-profile.html',
        controller: 'editProfileController'
      }).
      when('/profile', {
        templateUrl: 'views/jobseeker/profile.html',
        controller: 'profileController'
      }).
      when('/upskill', {
        templateUrl: 'views/jobseeker/upskill.html',
        controller: 'upskillController'
      }).
      when('/resume', {
        templateUrl: 'views/jobseeker/resume.html',
        controller: 'resumeController'
      }).
      when('/myWorkDiary', {
        templateUrl: 'views/jobseeker/my-work-diary.html',
        controller: 'myWorkDiaryController'
      }).
      when('/myWorkHistory', {
        templateUrl: 'views/jobseeker/my-work-history.html',
        controller: 'myWorkHistoryController'
      }).
      when('/notification', {
        templateUrl: 'views/jobseeker/notifications.html',
        controller: 'notificationController'
      }).
      when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'settingsController'
      }).
      when('/search', {
        templateUrl: 'views/employer/search.html',
        controller: 'searchController'
      }).
      when('/homeScreen', {
        templateUrl: 'views/employer/home-screen.html',
        controller: 'homeScreenController'
      }).
      when('/browseCandidates', {
        templateUrl: 'views/employer/browse-candidates.html',
        controller: 'browseCandidatesController'
      }).
      when('/viewActiveRoles', {
        templateUrl: 'views/employer/view-active-roles.html',
        controller: 'viewActiveRolesController'
      }). 
      when('/iphone', {
        redirectTo: '/login'
      }).
      when('/ipad', {
        redirectTo: '/homeScreen'
      }).
      otherwise({
        redirectTo: '/iphone'
      }); 
    $facebookProvider.setAppId(FACEBOOK_APP_ID);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  }
]);
srJobs.run(['$route','$rootScope', '$location', '$timeout','$window','$anchorScroll',
  function($route,$rootScope, $location, $timeout, $window,$anchorScroll) {
    $rootScope.$on( "$locationChangeSuccess", function( event, next, current ) {

      $rootScope.page=$location.path().substring(1); 
      
      if($location.path().substring(1)=='resume') $rootScope.resume=true;
      else $rootScope.resume=false;

      if($location.path().substr(1)=='home'){
        $rootScope.home = $rootScope.user = $rootScope.settings = true;
        $rootScope.back = false;
      }
      else if($location.path().substr(1)=='createProfile' ||$location.path().substr(1)=='createAccount' || $location.path().substr(1)=='login' || $location.path().substr(1)=='forgotPassword'){
        $rootScope.home = $rootScope.user = $rootScope.settings = $rootScope.back =false;
        $rootScope.search= false; 
      }
      else if($location.path().substr(1)=='profile'){
        $rootScope.home = $rootScope.user = $rootScope.back =true;
        $rootScope.settings = $rootScope.search = false;
      }
      else if($location.path().substr(1)=='resume' || $location.path().substr(1)=='upskill' || $location.path().substr(1)=='editProfile' || $location.path().substr(1)=='myWorkDiary'|| $location.path().substr(1)=='myWorkHistory' || $location.path().substr(1)=='notification' ){
        $rootScope.home = $rootScope.user = $rootScope.settings = $rootScope.back =true;
        $rootScope.search = false;
      }
      else if($location.path().substr(1)=='settings'){
        if($window.localStorage.getItem('appType')=='home'){ 
          $rootScope.home = $rootScope.user = $rootScope.settings = $rootScope.back =true;
          $rootScope.search= false; 
        } 
        else if($window.localStorage.getItem('appType')=='homeScreen'){ 
          $rootScope.home = $rootScope.settings = $rootScope.search = $rootScope.back =true;
        }

      }
      else{
        $rootScope.home = $rootScope.user = $rootScope.search = $rootScope.back =true;
        $rootScope.settings =false;
      }
      
      if($location.path().substring(1)=='homeScreen') $rootScope.back=false;

      
    });
  }
]);

// Load the facebook SDK
(function(){
   
   if (document.getElementById('facebook-jssdk')) {return;}

   var firstScriptElement = document.getElementsByTagName('script')[0];

   var facebookJS = document.createElement('script'); 
   facebookJS.id = 'facebook-jssdk';

   facebookJS.src = '//connect.facebook.net/en_US/all.js';

   firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
 }());   
