var imtrade = angular.module("imtrade", ['ngRoute','ngResource','ngDialog','ngDropdowns','angularMoment','ngCookies','angularFileUpload']);

imtrade.constant('SERVER_CREDENTIAL',{
    url: 'http://api.gocatalyze.com',
    port: '80',
	instance: 'imtrade',
    api_token: '23e8059d-8b41-4a9d-962e-1dc85caebe36',
    header: {"Content-Type" : "application/json"}    
});

imtrade.value('Session', {
    isActiveClass:'',
    pid: '',
    uid:'',
    api_key:'',
    isLogin: false
});

// configure our routes
imtrade.config(function($routeProvider, $locationProvider) {
  $routeProvider

  // route for the home page
  .when('/', {
    templateUrl : 'views/welcome.html',
    controller  : 'homeController'
  })
  //route for the login page
  .when('/login', {
    templateUrl : 'views/login.html',
    controller  : 'loginController'
  })
  //route for the profile page
  .when('/profile', {
    templateUrl : 'views/profile.html',
    controller  : 'profileController'
  })
   //route for the account page
  .when('/account', {
    templateUrl : 'views/account.html',
    controller  : 'accountController'
  })
  //route for the profile
  .when('/logout', {
    templateUrl : 'views/logout.html',
    controller  : 'logoutController'
  })
 //route for the orders
  .when('/orders', {
    templateUrl : 'views/orders.html',
    controller  : 'ordersController'
  })
  // route for the order detail page
  .when('/order-details/:orderId', {
    templateUrl : 'views/order-details.html',
    controller  : 'orderdetailsController'
  })
   // route for the order detail page
  .when('/msg-full-mode/:msgId', {
    templateUrl : 'views/msg-full-mode.html',
    controller  : 'msgFullModeController'
  })
  // route for the enquiries page
  .when('/enquiries', {
    templateUrl : 'views/enquiries.html',
    controller  : 'enquiriesController'
  })

  // route for the invioce history page
  .when('/invoice-history', {
    templateUrl : 'views/invoice-history.html',
    controller  : 'invoicehistoryController'
  })

  // route for the not found page
  .otherwise({
    redirectTo: '/'
  });
  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
});
