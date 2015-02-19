srJobs.controller('searchController', ['$scope', '$window', '$rootScope',
  function ($scope, $window, $rootScope) {

    if ($window.localStorage.getItem('appType') !== 'homeScreen')
      $rootScope.locationRedirect('/');

    $scope.country = country[13];
    $scope.countries = country;
    $scope.showLocationEdit = false;

    $scope.toggleLocation = function () {
      $scope.showLocationEdit = !$scope.showLocationEdit;
    };

  }
]);

srJobs.controller('homeScreenController', ['$scope', '$window', '$rootScope', 'Role', 'Personal',
  function ($scope, $window, $rootScope, Role, Personal) {

    if ($window.localStorage.getItem('appType') !== 'homeScreen')
      $rootScope.locationRedirect('/');
  	

    $scope.toggleState = false;
    $scope.loadingBar1 = false;
    $scope.loadingBar2 = false;
    $scope.loadingBar3 = false;
    $scope.locationState = true;
    $scope.showLocationEdit = false;

    $scope.toggleModel = function () {
      $scope.showLocationEdit = false;
      $scope.locationState = true;
      $scope.toggleState = !$scope.toggleState;
      $scope.country = country[13];
      $scope.countries = country;
      $scope.roleForm = {};
      $scope.roleForm = new Role({api_key: $rootScope.users.api_token});
      $scope.roleForm.field_location_1 = $rootScope.users.profile.field_address;
      $rootScope.error_msgs = [];
    };

    $scope.toggleLocation = function () {
      $scope.showLocationEdit = !$scope.showLocationEdit;
    };

    $scope.browseCandidate = function (id) {
      $rootScope.cantidateId = id;
      $rootScope.locationRedirect('browseCandidates');
    };
    $scope.viewActiveRole = function (id) {
      $rootScope.roleId = id;
      $rootScope.locationRedirect('viewActiveRoles');
    };
    $scope.saveRole = function () {
      $scope.loadingBar3 = true;
      $rootScope.error_msgs = [];
      $scope.roleForm.field_location_1.country = $scope.country.value;
      if ($scope.roleForm.field_employer_1 === undefined)
        $rootScope.error_msgs.push("Employer Name Required");
      if ($scope.roleForm.field_role_description === undefined)
        $rootScope.error_msgs.push("Role Descritption Required");
      if ($scope.roleForm.field_role_title === undefined)
        $rootScope.error_msgs.push("Role Title Required");
      if ($scope.roleForm.field_role_status === '' || $scope.roleForm.field_role_status === undefined)
        $rootScope.error_msgs.push("Role Status Required");
      if ($scope.roleForm.field_required_availability === '' || $scope.roleForm.field_role_status === undefined)
        $rootScope.error_msgs.push("Availability Required");

      if ($rootScope.error_msgs.length === 0) {
        $scope.roleForm.$save().then(function () {
          $scope.toggleModel();
          $scope.loadingBar3 = false;
          $scope.loadingBar1 = true;
          $rootScope.roles_temp = Role.query({api_key: $rootScope.users.api_token});
          $rootScope.roles_temp.$promise.then(function () {
            $rootScope.roles = $rootScope.roles_temp;
            $scope.loadingBar1 = false;
          });
        });
      }
      else {
        $scope.loadingBar3 = false;
      }
    };
    $scope.loadingBar1 = true;
    $rootScope.roles = Role.query({api_key: $rootScope.users.api_token});
    $rootScope.roles.$promise.then(function () {
      $scope.loadingBar1 = false;
    });

    $scope.loadingBar2 = true;
    $rootScope.candidates = Personal.query({api_key: $rootScope.users.api_token});
    $rootScope.candidates.$promise.then(function () {
      $scope.loadingBar2 = false;
    });

  }
]);

srJobs.controller('browseCandidatesController', ['$scope', '$timeout', '$window', '$rootScope', 'Personal', 'Role', 'CandidateShortlist',
  function ($scope, $timeout, $window, $rootScope, Personal, Role, CandidateShortlist) {

    if ($window.localStorage.getItem('appType') !== 'homeScreen')
      $rootScope.locationRedirect('/');

    $scope.loading = false;
    $scope.loadingBar1 = false;
    $scope.selectAll = false;
    $scope.selectAllConfirm = false;
    $scope.locationState = true;

    $rootScope.roles = Role.query({api_key: $rootScope.users.api_token});

    $scope.reinitialize = function () {
      $scope.shortlistCandidate = {};
      $scope.shortlistCandidate = new CandidateShortlist({api_key: $rootScope.users.api_token});
      $scope.shortlistCandidate.field_profile = {};
      $scope.shortlistCandidate.field_role = {};
      $scope.shortlistCandidate.field_shortlisted_by = {};
    };

    $scope.reinitialize();

    $scope.tabIndex = $rootScope.cantidateId;
    $scope.vTabs = false;
    $scope.vTabsShow = false;
    $scope.accordian = false;
    $scope.toggleState = false;
    $scope.activeCandidate = [];
    $scope.rejected = [];

    $scope.loadingBar1 = true;
    $rootScope.candidates = Personal.query({api_key: $rootScope.users.api_token});

    $rootScope.candidates.$promise.then(function () {
      $timeout(function () {
        //document.getElementById("candidate-"+$scope.tabIndex).classList.add("resp-tab-active");
        $('#' + "candidate-" + $scope.tabIndex).addClass("resp-tab-active");
        if ($scope.vTabs === true) {
          //document.getElementById("tab_item-"+$scope.tabIndex).classList.add("resp-tab-active");
          $('#' + "tab_item-" + $scope.tabIndex).addClass("resp-tab-active");
          $scope.accordian = !$scope.accordian;
        }
        $scope.currentTTab = $scope.tabIndex;
        $scope.currentVTab = $scope.tabIndex;
        $scope.activeCandidate = $rootScope.candidates[$scope.tabIndex];
      }, 0);
      $scope.loadingBar1 = false;

      var i = 0;
      var count = $rootScope.candidates.length;
      for (; i < count; i++) {
        if (($rootScope.candidates[i].field_first_name === null) && ($rootScope.candidates[i].field_last_name === null)) {
          $rootScope.candidates.splice(i, 1);
          i--;
        }
        count = $rootScope.candidates.length;
      }
    });

    $scope.checkSelected = function () {
      if ($scope.selectAll === true) {
        var i = 0;
        var count = $rootScope.candidates.length;
        for (; i < count; i++) {
          if ($rootScope.candidates[i].field_first_name !== null || $rootScope.candidates[i].field_last_name !== null) {
            if ($scope.vTabs === true) {
              //document.getElementById("tab_item-"+i).classList.remove("resp-tab-active");
              $('#' + "tab_item-" + i).addClass("resp-tab-active");
            }
            else {
              //document.getElementById("candidate-"+i).classList.remove("resp-tab-active");
              $('#' + "candidate-" + i).addClass("resp-tab-active");
            }
          }
        }
        $scope.selectAll = false;
      }
    };

    $scope.openCandidate = function (id) {
      $scope.checkSelected();
      $scope.tabIndex = id;
      $scope.locationState = true;
      //document.getElementById("candidate-"+$scope.currentTTab).classList.remove("resp-tab-active");
      $('#' + "candidate-" + $scope.currentTTab).removeClass("resp-tab-active");
      $scope.currentTTab = id;
      //document.getElementById("candidate-"+$scope.tabIndex).classList.add("resp-tab-active");
      $('#' + "candidate-" + $scope.tabIndex).addClass("resp-tab-active");
      $scope.activeCandidate = $rootScope.candidates[$scope.tabIndex];
    };

    $scope.shortlistAll = function () {
      $scope.selectAll = true;
      $scope.selectAllConfirm = false;
      var i = 0;
      var count = $rootScope.candidates.length;
      for (; i < count; i++) {
        if ($rootScope.candidates[i].field_first_name !== null || $rootScope.candidates[i].field_last_name !== null) {
          if ($scope.vTabs === true) {
            //document.getElementById("tab_item-"+i).classList.add("resp-tab-active");
            $('#' + "tab_item-" + i).addClass("resp-tab-active");
          }
          else {
            // document.getElementById("candidate-"+i).classList.add("resp-tab-active");
            $('#' + "candidate-" + i).addClass("resp-tab-active");
          }
        }
      }
      $scope.toggleModel();

    };

    $scope.openCandidateV = function (id) {
      $scope.checkSelected();
      $scope.tabIndex = id;
      $scope.locationState = true;
      if ($scope.currentVTab === id) {
        $scope.accordian = !$scope.accordian;
        if ($scope.accordian === true) {
          //document.getElementById("tab_item-"+$scope.tabIndex).classList.add("resp-tab-active");
          $('#' + "tab_item-" + $scope.tabIndex).addClass("resp-tab-active");
        }
        else {
          //document.getElementById("tab_item-"+$scope.currentVTab).classList.remove("resp-tab-active");
          $('#' + "tab_item-" + $scope.currentVTab).removeClass("resp-tab-active");
        }
      }
      else {
        $scope.accordian = true;
        //document.getElementById("tab_item-"+$scope.currentVTab).classList.remove("resp-tab-active");
        //document.getElementById("tab_item-"+$scope.tabIndex).classList.add("resp-tab-active");
        $('#' + "tab_item-" + $scope.currentVTab).removeClass("resp-tab-active");
        $('#' + "tab_item-" + $scope.tabIndex).addClass("resp-tab-active");
      }

      $scope.currentVTab = id;
      $scope.activeCandidate = $rootScope.candidates[$scope.tabIndex];
    };

    $scope.dismissT = function (index, flag) {
      //var classes = document.getElementById("candidate-"+index).className;
      var classes = $('#' + "candidate-" + index).attr('class').split(/\s+/);
      if (flag === 1)
        $scope.rejected.push($rootScope.candidates[index]);
      if (classes[3] === "resp-tab-active") {
        if ($rootScope.candidates.length > 0 && index > 0) {
          //document.getElementById("candidate-"+$scope.currentTTab).classList.remove("resp-tab-active");
          $('#' + "candidate-" + $scope.currentTTab).removeClass("resp-tab-active");
          $rootScope.candidates.splice(index, 1);
          $scope.currentTTab = index - 1;
          $scope.tabIndex = index - 1;
          //document.getElementById("candidate-"+$scope.currentTTab).classList.add("resp-tab-active");
          $('#' + "candidate-" + $scope.currentTTab).addClass("resp-tab-active");
        }
        else if ($rootScope.candidates.length > 1 && index === 0) {
          //document.getElementById("candidate-"+$scope.currentTTab).classList.remove("resp-tab-active");
          $('#' + "candidate-" + $scope.currentTTab).removeClass("resp-tab-active");
          $rootScope.candidates.splice(index, 1);
          $scope.currentTTab = 0;
          $scope.tabIndex = 0;
          //document.getElementById("candidate-1").classList.add("resp-tab-active");
          $('#' + "candidate-1").addClass("resp-tab-active");
        }
        else if ($rootScope.candidates.length === 1 && index === 0) {
          $scope.currentTTab = 0;
          $scope.tabIndex = 0;
          //document.getElementById("candidate-"+$scope.currentTTab).classList.remove("resp-tab-active");
          $('#' + "candidate-" + $scope.currentTTab).removeClass("resp-tab-active");
          $rootScope.candidates.splice(index, 1);
        }
        $scope.activeCandidate = $rootScope.candidates[$scope.tabIndex];
      }
    };

    $scope.dismissV = function (index, flag) {
      var classes = document.getElementById("tab_item-" + index).classList;
      if (classes[1] === "resp-tab-active" || $scope.selectAll === true) {
        //document.getElementById("tab_item-"+$scope.currentVTab).classList.remove("resp-tab-active");
        $('#' + "tab_item-" + $scope.currentVTab).removeClass("resp-tab-active");
        $scope.currentVTab = 0;
        $scope.tabIndex = 0;
        if (flag === 1)
          $scope.rejected.push($rootScope.candidates[index]);
        $rootScope.candidates.splice(index, 1);
        $scope.accordian = !$scope.accordian;
        $scope.activeCandidate = $rootScope.candidates[$scope.tabIndex];
      }
    };

    $scope.toggleModel = function () {
      $scope.toggleState = !$scope.toggleState;
      $scope.selectAllConfirm = false;
    };

    $scope.reshortlist = function () {
      var i = 0;
      var count = $scope.rejected.length;
      $scope.selectAll = false;
      for (; i < count; i++)
        $rootScope.candidates.push($scope.rejected[i]);
      $scope.rejected = [];
      $timeout(function () {
        //document.getElementById("candidate-"+$scope.tabIndex).classList.add("resp-tab-active");
        $('#' + "candidate-" + $scope.tabIndex).addClass("resp-tab-active");
        if ($scope.vTabs === true) {
          //document.getElementById("tab_item-"+$scope.tabIndex).classList.add("resp-tab-active");
          $('#' + "tab_item-" + $scope.tabIndex).addClass("resp-tab-active");
          $scope.accordian = !$scope.accordian;
        }
        $scope.currentTTab = $scope.tabIndex;
        $scope.currentVTab = $scope.tabIndex;
        $scope.activeCandidate = $rootScope.candidates[$scope.tabIndex];
      }, 0);
    };

    $scope.shortlist = function (index) {
      $scope.loading = true;
      if ($scope.selectAll === false) {
        $scope.shortlistCandidate.field_profile.target_id = $scope.activeCandidate.pid;
        $scope.shortlistCandidate.field_role.target_id = $rootScope.roles[index].id;
        $scope.shortlistCandidate.field_shortlisted_by.target_id = $rootScope.users.profile.pid;
        $scope.shortlistCandidate.$save().then(function () {
          $scope.loading = false;
          $scope.toggleModel();
          $scope.reinitialize();
          if ($scope.vTabs === true)
            $scope.dismissV($scope.tabIndex, 0);
          else
            $scope.dismissT($scope.tabIndex, 0);
        });
      }
      else if ($scope.selectAll === true) {
        var i = 0;
        var count = $rootScope.candidates.length;
        $scope.selectAllConfirm = true;
        $scope.selectAllCount = 0;
        $scope.selectedRole = $rootScope.roles[index];
        $scope.selectAllConfirm = true;
        for (; i < count; i++) {
          $scope.loading = true;
          $scope.activeCandidate = $rootScope.candidates[i];
          $scope.shortlistCandidate.field_profile.target_id = $rootScope.candidates[i].pid;
          $scope.shortlistCandidate.field_role.target_id = $rootScope.roles[index].id;
          $scope.shortlistCandidate.field_shortlisted_by.target_id = $rootScope.users.profile.pid;
          if ($rootScope.candidates[i].field_first_name !== null || $rootScope.candidates[i].field_last_name !== null) {
            $scope.shortlistCandidate.$save().then(function () {
              $scope.loading = false;
              $scope.selectAllCount++;
            });
          }
          $scope.reinitialize();
        }
        i = count - 1;
        for (; i >= 0; i--) {
          if ($rootScope.candidates[i].field_first_name !== null || $rootScope.candidates[i].field_last_name !== null) {
            if ($scope.vTabs === true)
              $scope.dismissV(i, 0);
            else
              $scope.dismissT(i, 0);
          }
        }
      }
    };

  }
]);

srJobs.controller('viewActiveRolesController', ['$scope', '$timeout', '$window', '$rootScope', 'Role', 'CandidateShortlist', 'Profile', 'Personal',
  function ($scope, $timeout, $window, $rootScope, Role, CandidateShortlist, Profile, Personal) {

    if ($window.localStorage.getItem('appType') !== 'homeScreen')
      $rootScope.locationRedirect('/');

    $scope.tabIndex = $rootScope.roleId;
    $scope.vTabs = false;
    $scope.vTabsShow = false;
    $scope.accordian = false;
    $scope.activeRole = [];
    $scope.loadingBar1 = false;
    $scope.loadingBar2 = false;
    $scope.loadingBar3 = false;
    $scope.loadingBar4 = false;
    $rootScope.shortlistedCandidates = [];
    $scope.showLocationEdit = false;
    $scope.showLocationEdit1 = false;
    $scope.locationState = true;

    $scope.toggleState = $scope.toggleState1 = $scope.toggleState2 = false;

    $scope.toggleLocation = function () {
      $scope.showLocationEdit = !$scope.showLocationEdit;
    };

    $scope.toggleLocation1 = function () {
      $scope.showLocationEdit1 = !$scope.showLocationEdit1;
    };

    $rootScope.candidates = Personal.query({api_key: $rootScope.users.api_token});
    $scope.browseCandidate = function (id) {
      var i = 0;
      for (i = 0; i < $rootScope.candidates.length; i++) {
        if ($rootScope.candidates[i].pid == id)
          break;
      }
      $rootScope.cantidateId = i;
      $rootScope.locationRedirect('browseCandidates');
    };

    $scope.toggleModel = function () {
      $scope.showLocationEdit = false;
      $scope.showLocationEdit = false;
      $scope.toggleState = !$scope.toggleState;
      $rootScope.error_msgs = [];
      if ($scope.toggleState === true) {
        $scope.roleForm = {};
        $scope.roleForm = new Role({api_key: $rootScope.users.api_token});
        $scope.roleForm.field_location_1 = $rootScope.users.profile.field_address;
        $scope.country = country[13];
        $scope.countries = country;
      }
    };
    $scope.toggleModel2 = function () {
      $scope.toggleState2 = !$scope.toggleState2;
      $scope.activeRole = $rootScope.roles[$scope.tabIndex];
      if ($scope.toggleState2 === true) {
        $rootScope.shortlistedCandidates = [];
        $scope.loadingBar4 = true;

        $rootScope.shortlistedCandidates = CandidateShortlist.query({
          field_role: $rootScope.roles[$scope.tabIndex].id,
          expand: 1,
          api_key: $rootScope.users.api_token
        });
        $rootScope.shortlistedCandidates.$promise.then(function () {
          $scope.loadingBar4 = false;
        });
      }
    };

    $scope.toggleModel1 = function () {
      $scope.showLocationEdit1 = false;
      $scope.showLocationEdit1 = false;
      $scope.toggleState1 = !$scope.toggleState1;
      $scope.country = country[13];
      $scope.countries = country;
      $rootScope.error_msgs = [];
      if ($scope.toggleState1 === true) {
        $scope.roleForm = {};
        $scope.roleForm = new Role({id: $rootScope.roles[$scope.tabIndex].id, api_key: $rootScope.users.api_token});
        $scope.roleForm.field_location_1 = {};
        $scope.roleForm.field_location_1 = $rootScope.roles[$scope.tabIndex].field_location_1;
        $scope.field_geo = $rootScope.roles[$scope.tabIndex].field_geo;
        $scope.roleForm.field_employer_1 = $rootScope.roles[$scope.tabIndex].field_employer_1;
        $scope.roleForm.field_role_description = $rootScope.roles[$scope.tabIndex].field_role_description;
        $scope.roleForm.field_preferred_experience = $rootScope.roles[$scope.tabIndex].field_preferred_experience;
        $scope.roleForm.field_role_title = $rootScope.roles[$scope.tabIndex].field_role_title;
        $scope.roleForm.field_role_status = $rootScope.roles[$scope.tabIndex].field_role_status;
        $scope.roleForm.field_required_availability = $rootScope.roles[$scope.tabIndex].field_required_availability;
      }
    };

    $scope.loadingBar1 = true;
    $rootScope.roles = Role.query({api_key: $rootScope.users.api_token});

    $rootScope.roles.$promise.then(function () {
      $timeout(function () {
        document.getElementById("tab_item-" + $scope.tabIndex).classList.add("resp-tab-active");
        if ($scope.vTabs === true) {
          document.getElementById("Vtab_item-" + $scope.tabIndex).classList.add("resp-tab-active");
          $scope.accordian = !$scope.accordian;
        }
        $scope.currentTTab = $scope.tabIndex;
        $scope.currentVTab = $scope.tabIndex;
      }, 0);
      $scope.loadingBar1 = false;
    });

    $scope.openRole = function (id) {
      $scope.locationState = true;
      $scope.tabIndex = id;
      document.getElementById("tab_item-" + $scope.currentTTab).classList.remove("resp-tab-active");
      $scope.currentTTab = id;
      document.getElementById("tab_item-" + $scope.tabIndex).classList.add("resp-tab-active");
    };
    $scope.openRoleV = function (id) {
      $scope.locationState = true;
      $scope.tabIndex = id;
      if ($scope.currentVTab === id) {
        $scope.accordian = !$scope.accordian;
        if ($scope.accordian === true)
          document.getElementById("Vtab_item-" + $scope.tabIndex).classList.add("resp-tab-active");
        else {
          document.getElementById("Vtab_item-" + $scope.currentVTab).classList.remove("resp-tab-active");
        }
      }
      else {
        $scope.accordian = true;
        document.getElementById("Vtab_item-" + $scope.currentVTab).classList.remove("resp-tab-active");
        document.getElementById("Vtab_item-" + $scope.tabIndex).classList.add("resp-tab-active");
      }

      $scope.currentVTab = id;
    };

    $scope.validateRole = function () {

      $scope.roleForm.field_location_1.country = $scope.country.value;

      if ($scope.roleForm.field_employer_1 === undefined)
        $rootScope.error_msgs.push("Employer Name Required");
      if ($scope.roleForm.field_role_description === undefined)
        $rootScope.error_msgs.push("Role Descritption Required");
      if ($scope.roleForm.field_role_title === undefined)
        $rootScope.error_msgs.push("Role Title Required");
      if ($scope.roleForm.field_role_status === '' || $scope.roleForm.field_role_status === undefined)
        $rootScope.error_msgs.push("Role Status Required");
      if ($scope.roleForm.field_required_availability === '' || $scope.roleForm.field_role_status === undefined)
        $rootScope.error_msgs.push("Availability Required");

    };

    $scope.saveRole = function () {
      $scope.loadingBar2 = true;
      $scope.validateRole();
      if ($rootScope.error_msgs.length === 0) {
        $scope.roleForm.$save().then(function () {
          $scope.toggleModel();
          $scope.loadingBar2 = false;
          $scope.loadingBar1 = true;
          $rootScope.roles_temp = Role.query({api_key: $rootScope.users.api_token});
          $rootScope.roles_temp.$promise.then(function () {
            $rootScope.roles = $rootScope.roles_temp;
            $scope.loadingBar1 = false;
          });
          $scope.roleForm = {};
          $scope.roleForm = new Role({api_key: $rootScope.users.api_token});
        });
      }
      else {
        $scope.loadingBar2 = false;
      }
    };
    $scope.updateRole = function () {
      $scope.loadingBar3 = true;
      $scope.validateRole();
      if ($rootScope.error_msgs.length === 0) {
        $scope.roleForm.$update().then(function () {
          $scope.toggleModel1();
          $scope.loadingBar3 = false;
          $scope.loadingBar1 = true;
          $rootScope.roles_temp = Role.query({api_key: $rootScope.users.api_token});
          $rootScope.roles_temp.$promise.then(function () {
            $rootScope.roles = $rootScope.roles_temp;
            $scope.loadingBar1 = false;
          });
        });
      }
      else {
        $scope.loadingBar3 = false;
      }
    };

  }
]);