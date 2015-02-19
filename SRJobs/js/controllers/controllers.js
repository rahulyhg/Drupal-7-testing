srJobs.controller('CommonController', ['$scope', '$rootScope', '$location', '$window', 'GCEntity', 'Role', 'Personal',
  function ($scope, $rootScope, $location, $window, GCEntity, Role, Personal) {
    $rootScope.firstTimeLogin = false;
    $rootScope.userHasRole =false;
    $rootScope.organisation = [];
    $rootScope.home = false;
    $rootScope.user = false;
    $rootScope.settings = false;
    $rootScope.back = false;
    $rootScope.search = false;
    $rootScope.resume = false;
    $rootScope.vTabs = false;
    $rootScope.persons = [];
    $rootScope.cantidateId = 0;
    $rootScope.roleId = 0;
    $rootScope.appType = $window.localStorage.getItem('appType');
    $rootScope.toggleState = false;
    $rootScope.users = JSON.parse($window.localStorage.getItem('user'));
    $rootScope.page = $location.path().substring(1);
    $scope.loadingBar3 = false;

    $rootScope.locationRedirect = function (pathVal) {
      $location.path(pathVal);
    };

    $rootScope.pad = function (str, max) {
      str = str.toString();
      return str.length < max ? $rootScope.pad("0" + str, max) : str;
    };

    $rootScope.isValidDate = function (y, m, d) {
      var composedDate = new Date(d, m - 1, y);
      if ($rootScope.pad(composedDate.getFullYear(), 4) === d)
        if ($rootScope.pad(composedDate.getDate(), 2) === y)
          if ($rootScope.pad(composedDate.getMonth() + 1, 2) === m)
            return true;
      return false;
    };

    $rootScope.optionGenerator = function (label, startVal, endVal, padding) {
      var item = [];
      item.push({label: label, value: '-1'});
      for (; startVal <= endVal; startVal++)
        item.push({label: $rootScope.pad(startVal, padding), value: $rootScope.pad(startVal, padding)});
      return item;
    };

    $scope.doLogout = function () {
      $scope.loadingBar3 = true;
      $window.localStorage.clear();
      $rootScope.users = [];
      $rootScope.locationRedirect('login');
      $scope.loadingBar3 = false;
    };

    $rootScope.doTheBack = function () {
      $window.history.back();
    };

    $rootScope.urlEncodes = function (str) {
      return encodeURI(str);
    };

    $rootScope.indexOfRowContainingId = function (index, id, matrix) {
      for (var i = 0, len = matrix.length; i < len; i++)
        if (matrix[i][index] == id) return i;
      return 0;
    };

    if ($rootScope.page !== "login" && $rootScope.page !== "createAccount" && $rootScope.page !== "forgotPassword" && $rootScope.page !== "createProfile") {
      if ($rootScope.users !== '' && $rootScope.users !== null && $rootScope.users !== undefined) {
        if ($rootScope.users.api_token === '' || $rootScope.users.api_token === null || $rootScope.users.api_token === undefined)
          $rootScope.locationRedirect('/');
      }
      else
        $rootScope.locationRedirect('/');
    }
    //Display organisation by name.
    $scope.getOrgByName = function(id){
      for(var i =0; i< $rootScope.organisation.length; i++){
        if($rootScope.organisation[i].pid == id)
          return $rootScope.organisation[i].field_organisation_name;
      }
    };
  }
]);

srJobs.controller('loginController', ['$scope', '$rootScope', '$http', '$window', 'GCEntity', '$timeout',
  function ($scope, $rootScope, $http, $window, GCEntity, $timeout) {
    $scope.auth = {};
    $scope.error = false;
    if ($window.localStorage.getItem('user') !== null)
      $rootScope.locationRedirect($rootScope.appType);

    $scope.doLogin = function () {
      $window.scrollTo(0, 0);
      if ($scope.auth.username === undefined || $scope.auth.password === undefined) {
        $scope.error = true;
        return 0;
      }

      $scope.error = false;
      $scope.loading = true;
      $scope.auth.instance = API_INSTANCE;
      $rootScope.persons = [];
      var config = {headers: {"Content-Type": "application/json;charset=UTF-8"}};
      $http.post(API_URL + ':' + API_PORT + '/account/login.json', $scope.auth, config).success(function (data) {
        $rootScope.users = data;
        if ($rootScope.users.api_token !== '' && $rootScope.users.api_token !== null && $rootScope.users.api_token !== undefined) {
          $scope.error = false;
          angular.forEach($rootScope.users.roles, function (value, key) {
            if ($rootScope.users.roles[key] === 'Staff' || $rootScope.users.roles[key] === 'Employer') {
              $rootScope.appType = 'homeScreen';
              $window.localStorage.setItem('appType', $rootScope.appType);
              $rootScope.userHasRole = true;
              return 1;
            }
            else {
              $rootScope.appType = 'home';
              $rootScope.userHasRole = false;
            }
            $window.localStorage.setItem('appType', $rootScope.appType);
          });

          $window.localStorage.setItem('user', JSON.stringify($rootScope.users));

          $scope.loading = false;
          $rootScope.locationRedirect($rootScope.appType);
        }
        else {
          $scope.auth = '';
          $scope.error = true;
          $scope.loading = false;
        }
      }).error(function (data, status, headers, config) {
        $scope.auth = '';
        $scope.error = true;
        $scope.loading = false;
      });
    };
  }
]);

srJobs.controller('createAccountController', ['$scope', '$rootScope', '$facebook', '$window',
  function ($scope, $rootScope, $facebook, $window) {
    $scope.isLoggedIn = false;

    if ($window.localStorage.getItem('user') !== null)
      $rootScope.locationRedirect($rootScope.appType);

    $scope.login = function () {
      $facebook.login().then(function () {
        refresh();
      });
    };
    $scope.logout = function () {
      $facebook.logout().then(function () {
        refresh();
      });
    };
    function refresh() {
      $facebook.api("/me").then(
        function (response) {
          $scope.welcomeMsg = "Welcome " + response.name;
          $scope.isLoggedIn = true;
        },
        function (err) {
          $scope.isLoggedIn = false;
          $scope.welcomeMsg = "Please log in";
        });
    }

    refresh();
  }
]);

srJobs.controller('createProfileController', ['$scope', '$rootScope', '$facebook', '$window', '$http',
  function ($scope, $rootScope, $facebook, $window, $http) {

    if ($window.localStorage.getItem('user') !== null)
      $rootScope.locationRedirect($rootScope.appType);

  	$scope.personel = '1';
    $scope.register = {};
    $scope.register.instance = API_INSTANCE;
    var config = {headers: {"Content-Type": "application/json;charset=UTF-8"}};
    $scope.register.data = {};
    $scope.register.data.profile = {};
    $scope.auth = {};
    $scope.actionCF = function () {
      $rootScope.error_msgs = [];
      $window.scrollTo(0, 0);
      if ($scope.register.data.profile.field_first_name == undefined)
        $rootScope.error_msgs.push("First name required.");
      if ($scope.register.data.profile.field_last_name == undefined)
        $rootScope.error_msgs.push("Last name required.");
      if ($scope.register.email == undefined)
        $rootScope.error_msgs.push("Email required.");
      if ($scope.register.password == undefined)
        $rootScope.error_msgs.push("password required.");
      if ($scope.register.password !== $scope.confirm_password)
        $rootScope.error_msgs.push("Password Mismatched.");
      if ($scope.register.email.replace(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/, '') !== '')
        $rootScope.error_msgs.push("Invalid email");

      if ($rootScope.error_msgs.length === 0) {
        $scope.loadingBar = true;
        $scope.register.username = $scope.register.email;
        $scope.auth.username = $scope.register.username;
        $scope.auth.password = $scope.register.password;
        $scope.auth.instance = API_INSTANCE;
        
        if($scope.personel == '2')
        	$scope.register.data.roles = ["Employer"];
 
        $http.post(API_URL + ':' + API_PORT + '/account/register.json', $scope.register, config).success(function (data) {
          $rootScope.firstTimeLogin = true;
          $http.post(API_URL + ':' + API_PORT + '/account/login.json', $scope.auth, config).success(function (data) {
            $rootScope.users = data;
            angular.forEach($rootScope.users.roles, function (value, key) {
            	if ($rootScope.users.roles[key] === 'Staff' || $rootScope.users.roles[key] === 'Employer') {
              		$rootScope.appType = 'homeScreen';
              		$window.localStorage.setItem('appType', $rootScope.appType);
              		$rootScope.userHasRole = true;
              		return 1;
            	}
            	else {
              		$rootScope.appType = 'home';
              		$rootScope.userHasRole = false;
            	}
            	$window.localStorage.setItem('appType', $rootScope.appType);
          	});
            $window.localStorage.setItem('user', JSON.stringify($rootScope.users));
            $scope.loadingBar = false;
            $rootScope.locationRedirect('profile');
          });
        }).error(function (data, status, headers, config) {
          $rootScope.error_msgs.push("Sorry, it appears the email address is already being used by another account. Please re-check the email address and provide a alternate one.");
          $scope.loadingBar = false;
        });
      }
    };
  }
]);

srJobs.controller('forgotPasswordController', ['$scope', '$rootScope', '$facebook', '$window',
  function ($scope, $rootScope, $facebook, $window) {

    if ($window.localStorage.getItem('user') !== null)
      $rootScope.locationRedirect($rootScope.appType);

  }
]);

srJobs.controller('settingsController', ['$scope', '$window', '$rootScope', 'Profile',
  function ($scope, $window, $rootScope, Profile) {

    if ($window.localStorage.getItem('appType') !== 'home' && $window.localStorage.getItem('appType') !== 'homeScreen')
      $rootScope.locationRedirect('/');

    $scope.loadingBar = false;
    $scope.toggleState = false;
    $scope.loadingBar1 = false;
    $scope.loadingBar2 = false;
    if ($rootScope.users.profile.field_email_notifications === undefined || $rootScope.users.profile.field_email_notifications === 0)
      $scope.field_email_notifications = 0;
    else
      $scope.field_email_notifications = 1;

    if ($rootScope.users.profile.field_push_notifications === undefined || $rootScope.users.profile.field_push_notifications === 0)
      $scope.field_push_notifications = 0;
    else
      $scope.field_push_notifications = 1;

    $scope.toggleState1 = $scope.field_email_notifications;
    $scope.toggleState2 = $scope.field_push_notifications;
    $scope.toggleModel = function () {
      $scope.toggleState = !$scope.toggleState;
    };

    $scope.toggleModel1 = function () {
      $scope.toggleState1 = !$scope.toggleState1;
      $scope.field_email_notifications = $scope.toggleState1;
      $scope.editPF = {};
      if ($scope.field_email_notifications === undefined || $scope.field_email_notifications === false)
        $scope.editPF.field_email_notifications = 0;
      else if ($scope.field_email_notifications === true)
        $scope.editPF.field_email_notifications = 1;

      $scope.loadingBar1 = true;
      Profile.update({ id: $rootScope.users.profile.pid, api_key: $rootScope.users.api_token}, $scope.editPF).$promise.then(function () {
        $scope.updatedProfile = Profile.get({ id: $rootScope.users.profile.pid, api_key: $rootScope.users.api_token});
        $scope.updatedProfile.$promise.then(function (result) {
          $scope.loadingBar1 = false;
          $rootScope.users.profile = result;
          $window.localStorage.setItem('user', JSON.stringify($rootScope.users));
        });
      });

    };
    $scope.toggleModel2 = function () {
      $scope.toggleState2 = !$scope.toggleState2;
      $scope.field_push_notifications = $scope.toggleState2;
      $scope.editPF = {};
      if ($scope.field_push_notifications === undefined || $scope.field_push_notifications === false)
        $scope.editPF.field_push_notifications = 0;
      else if ($scope.field_push_notifications === true)
        $scope.editPF.field_push_notifications = 1;
      $scope.loadingBar2 = true;
      Profile.update({ id: $rootScope.users.profile.pid, api_key: $rootScope.users.api_token}, $scope.editPF).$promise.then(function () {
        $scope.updatedProfile = Profile.get({ id: $rootScope.users.profile.pid, api_key: $rootScope.users.api_token});
        $scope.updatedProfile.$promise.then(function (result) {
          $scope.loadingBar2 = false;
          $rootScope.users.profile = result;
          $window.localStorage.setItem('user', JSON.stringify($rootScope.users));
        });
      });
    };
  }
]);

