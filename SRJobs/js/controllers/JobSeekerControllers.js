
srJobs.controller('homeController', ['$scope', '$rootScope', '$window', 'Notification', 'WorkDiary',
  function ($scope, $rootScope, $window, Notification, WorkDiary) {
    if ($window.localStorage.getItem('appType') !== 'home')
      $rootScope.locationRedirect('/');
    $scope.notifications = Notification.query({api_key: $rootScope.users.api_token});
    $scope.updatedDays = [];
    $scope.updatedDays = WorkDiary.query({
      sort_by: 'field_work_diary_date',
      sort_dir: 'DESC',
      limit: '1',
      offset: '0',
      api_key: $rootScope.users.api_token
    });
    $scope.timediff = function (date) {
      var date1 = new Date();
      var date2 = new Date(date.replace(" ", "T"));
      var _MS_PER_DAY = 1000 * 60 * 60 * 24;
      var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
      var utc2;
      if (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1)
        utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      else
        utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate() - 1);
      return Math.floor((utc1 - utc2) / _MS_PER_DAY);
    };
    $scope.welcome = function () {
      var welcomeDate = new Date();
      var welcomeHour = (((welcomeDate.getHours() * 3600) + (welcomeDate.getMinutes() * 60)) / (3600));

      if (welcomeHour < 12)
        return 'Good morning';
      else if (welcomeHour >= 12 && welcomeHour <= 17)
        return 'Good afternoon';
      else if (welcomeHour > 17 && welcomeHour <= 24)
        return 'Good afternoon';

    };
    $scope.firstLoginToggle = function () {
      $rootScope.firstTimeLogin = false;
    }
  }
]);

srJobs.controller('editProfileController', ['$scope', '$rootScope', '$window', 'Profile',
  function ($scope, $rootScope, $window, Profile) {
    $scope.editPF = {};
    /*if ($window.localStorage.getItem('appType') !== 'home')
      $rootScope.locationRedirect('/');*/
    $scope.locationState = true;
    $scope.showNameEdit = false;
    $scope.showLocationEdit = false;

    $scope.toggleName = function () {
      $scope.showNameEdit = !$scope.showNameEdit;
    };

    $scope.toggleLocation = function () {
      $scope.showLocationEdit = !$scope.showLocationEdit;
    };

    $scope.reinitialize = function () {
      $scope.editPF.field_first_name = $rootScope.users.profile.field_first_name;
      $scope.editPF.field_last_name = $rootScope.users.profile.field_last_name;
      $scope.editPF.field_dob = $rootScope.users.profile.field_dob;
      $scope.editPF.field_phone = {};
      if($rootScope.users.profile.field_phone !== null)
        $scope.editPF.field_phone.number = $rootScope.users.profile.field_phone.number;
      $scope.editPF.field_mobile = {};
      if($rootScope.users.profile.field_mobile !== null)
        $scope.editPF.field_mobile.number = $rootScope.users.profile.field_mobile.number;
      $scope.editPF.field_gender = $rootScope.users.profile.field_gender;
      $scope.editPF.field_geo = {};
      if($rootScope.users.profile.field_geo !== null){
        $scope.editPF.field_geo.lat = $rootScope.users.profile.field_geo.lat;
        $scope.editPF.field_geo.lon = $rootScope.users.profile.field_geo.lon;
      }
      $scope.editPF.field_address = {};
      if($rootScope.users.profile.field_address !== null) {
        $scope.editPF.field_address.country = $rootScope.users.profile.field_address.country;
        $scope.editPF.field_address.administrative_area = $rootScope.users.profile.field_address.administrative_area;
        $scope.editPF.field_address.locality = $rootScope.users.profile.field_address.locality;
        $scope.editPF.field_address.postal_code = $rootScope.users.profile.field_address.postal_code;
        $scope.editPF.field_address.thoroughfare = $rootScope.users.profile.field_address.thoroughfare;
      }
      $scope.editPF.field_organisation = {};

      if ($rootScope.users.profile.field_organisation && $rootScope.users.profile.field_organisation.target_id) {
        $scope.editPF.field_organisation.target_id = $rootScope.users.profile.field_organisation.target_id;
      } else {
        $scope.editPF.field_organisation.target_id = 12;//temp
      }

      $scope.editPF.field_status = $rootScope.users.profile.field_status;
      $scope.editPF.field_availability = $rootScope.users.profile.field_availability;
      $scope.editPF.field_willing_to_travel = $rootScope.users.profile.field_willing_to_travel;
      $scope.editPF.field_preferred_industry = $rootScope.users.profile.field_preferred_industry;
      $scope.editPF.field_your_skills = $rootScope.users.profile.field_your_skills;
      $scope.editPF.field_your_qualifications = $rootScope.users.profile.field_your_qualifications;
      $scope.editPF.field_owner = {};
      $scope.editPF.field_owner.target_id = $rootScope.users.profile.pid;
    };
    $scope.reinitialize();
    $scope.loadingBar1 = false;
    $rootScope.error_msgs = [];
    $scope.dayss = $rootScope.optionGenerator('DD', 1, 31, 2);
    $scope.months = $rootScope.optionGenerator('MM', 1, 12, 2);
    var year = new Date().getFullYear();
    $scope.years = $rootScope.optionGenerator('YYYY', (year - 55), year, 4);
    $scope.hours = $rootScope.optionGenerator('HH', 0, 23, 2);
    $scope.minutes = $rootScope.optionGenerator('MM', 0, 59, 2);
    $scope.seconds = $rootScope.optionGenerator('SS', 0, 59, 2);

    if($rootScope.users.profile.field_dob !== null) {
      var dob = new Date($scope.editPF.field_dob.replace(" ", "T")); 
      $scope.dob_date={
          day: $scope.dayss[$rootScope.indexOfRowContainingId('value',dob.getDate(), $scope.dayss)],
          month : $scope.months[$rootScope.indexOfRowContainingId('value',(dob.getMonth()+1), $scope.months)],
          year : $scope.years[$rootScope.indexOfRowContainingId('value',dob.getFullYear(), $scope.years)],
      };
    }else{
      var dob = new Date(); 
      $scope.dob_date={
          day: $scope.dayss[$rootScope.indexOfRowContainingId('value',dob.getDate(), $scope.dayss)],
          month : $scope.months[$rootScope.indexOfRowContainingId('value',(dob.getMonth()+1), $scope.months)],
          year : $scope.years[$rootScope.indexOfRowContainingId('value',dob.getFullYear(), $scope.years)],
      };
    }
    $scope.distances = [
      {label: "Select", value: ''},
      {label: "5km", value: 1},
      {label: "10km", value: 2},
      {label: "25km", value: 3},
      {label: "50km", value: 4},
      {label: "Will relocate", value: 5}
    ];
    $scope.employments = [
      {label: "Select", value: ''},
      {label: "Seeking Employment", value: 1},
      {label: "Not Seeking Employment", value: 2}
    ];
    $scope.genders = [
      {label: "Select", value: ''},
      {label: "Male", value: "1"},
      {label: "Female", value: "2"}
    ];//change value for show default in edit profile page.
    $scope.industries = [
      {label: "Select", value: 'Select'},
      {label: "Information Technology", value: "1"},
      {label: "BPO", value: "2"}
    ];
    $scope.country = country[13];
    $scope.countries = country;

    $scope.filterCondition = {
      field_willing_to_travel: $scope.distances[$rootScope.indexOfRowContainingId('value', $scope.editPF.field_willing_to_travel, $scope.distances)],
      field_status: $scope.employments[$rootScope.indexOfRowContainingId('value', $scope.editPF.field_status, $scope.employments)],
      field_preferred_industry: $scope.industries[$rootScope.indexOfRowContainingId('value', $scope.editPF.field_preferred_industry, $scope.industries)],
      field_gender: $scope.genders[$rootScope.indexOfRowContainingId('value', $scope.editPF.field_gender, $scope.genders)],
      field_organisation1 : $rootScope.organisation[$rootScope.indexOfRowContainingId('pid', $scope.editPF.field_organisation.target_id, $rootScope.organisation)]
    };

    if ($rootScope.users.profile.field_availability === null) {
      $scope.availability = [];
    }
    else {
      $scope.availability = $rootScope.users.profile.field_availability.split(',');
    }

    $scope.availabilityCheck = function (word) {
      for (var i = 0; i < $scope.availability.length; i++)
        if ($scope.availability[i] === word) return true;
      return false;
    };

    $scope.days = $scope.availabilityCheck("days");
    $scope.evenings = $scope.availabilityCheck('evenings');
    $scope.nights = $scope.availabilityCheck('nights');
    $scope.weekends = $scope.availabilityCheck('weekends');

    $scope.updateProfile = function () {
      $scope.loadingBar1 = true;
      $window.scrollTo(0, 0);
      $rootScope.error_msgs = [];
      $scope.editPF.field_willing_to_travel = $scope.filterCondition.field_willing_to_travel.value;
      $scope.editPF.field_status = $scope.filterCondition.field_status.value;
      $scope.editPF.field_organisation.target_id = $scope.filterCondition.field_organisation1.pid;
      $scope.editPF.field_dob = $scope.dob_date.year.value + '-' + $scope.dob_date.month.value + '-' + $scope.dob_date.day.value + ' 00:00:00';
      $scope.editPF.field_gender = $scope.filterCondition.field_gender.value;
      $scope.editPF.field_address.country = $scope.country.value;
      $scope.tempAvailability = [];
      $scope.editPF.field_phone.country_codes = $scope.editPF.field_address.country;
      $scope.editPF.field_mobile.country_codes = $scope.editPF.field_address.country;

      if ($scope.days === true)
        $scope.tempAvailability.push("days");
      if ($scope.evenings === true)
        $scope.tempAvailability.push("evenings");
      if ($scope.nights === true)
        $scope.tempAvailability.push("nights");
      if ($scope.weekends === true)
        $scope.tempAvailability.push("weekends");

      $scope.editPF.field_availability = $scope.tempAvailability.join(',');
      if (!$rootScope.isValidDate($scope.dob_date.day.value, $scope.dob_date.month.value, $scope.dob_date.year.value))
        $rootScope.error_msgs.push("Invalid DOB");
      if ($rootScope.error_msgs.length === 0) {
        Profile.update({ id: $rootScope.users.profile.pid, api_key: $rootScope.users.api_token}, $scope.editPF).$promise.then(function () {
          $scope.updatedProfile = Profile.get({ id: $rootScope.users.profile.pid, api_key: $rootScope.users.api_token});
          $scope.updatedProfile.$promise.then(function (result) {
            $rootScope.users.profile = result;
            $window.localStorage.setItem('user', JSON.stringify($rootScope.users));
            $scope.reinitialize();
            $scope.loadingBar1 = false;
            $rootScope.locationRedirect('profile');
          });

        });
      }
      else {
        $scope.loadingBar1 = false;
      }
    };

  }
]);

srJobs.controller('profileController', ['$scope', '$rootScope', '$window','Organisation',
  function ($scope, $rootScope, $window, Organisation) {
    /*if ($window.localStorage.getItem('appType') !== 'home')
      $rootScope.locationRedirect('/');*/

    $scope.locationState = true;

    $scope.getCountry = function (value) {
      return country[$rootScope.indexOfRowContainingId('value', value, country)].label;
    };
	
	//List of all available organization.
    $rootScope.organisation = Organisation.query({
      api_key: $rootScope.users.api_token
    });
  }
]);

srJobs.controller('upskillController', ['$scope', '$rootScope', '$window',
  function ($scope, $rootScope, $window) {
    if ($window.localStorage.getItem('appType') !== 'home')
      $rootScope.locationRedirect('/');
  }
]);


srJobs.controller('resumeController', ['$scope', '$window', '$rootScope',
  function ($scope, $window, $rootScope) {
    if ($window.localStorage.getItem('appType') !== 'home')
      $rootScope.locationRedirect('/');
  }
]);

srJobs.controller('myWorkDiaryController', ['$scope', '$rootScope', '$window', 'WorkDiary',
  function ($scope, $rootScope, $window, WorkDiary) {
    if ($window.localStorage.getItem('appType') !== 'home')

      $rootScope.locationRedirect('/');
    $scope.workDiaryPopupFlag = $rootScope.workDiaryPopupFlag = '';
    $scope.due_date = [];

    $rootScope.days = $rootScope.optionGenerator('DD', 1, 31, 2);
    $rootScope.months = $rootScope.optionGenerator('MM', 1, 12, 2);
    var year = new Date().getFullYear();
    $rootScope.years = $rootScope.optionGenerator('YYYY', year, (year + 5), 4);
    $rootScope.hours = $rootScope.optionGenerator('HH', 0, 23, 2);
    $rootScope.minutes = $rootScope.optionGenerator('MM', 0, 59, 2);
    $rootScope.seconds = $rootScope.optionGenerator('SS', 0, 59, 2);
    $scope.loadingBar1 = false;
    $scope.toggleState = false;

    $scope.reinitialize = function () {
      $scope.jobApp = {};
      $scope.jobApp = new WorkDiary({api_key: $rootScope.users.api_token});
      $scope.due_date = {
        day: $rootScope.days[0],
        month: $rootScope.months[0],
        year: $rootScope.years[0]
      };
      $scope.interview_date = {
        day: $rootScope.days[0],
        month: $rootScope.months[0],
        year: $rootScope.years[0],
        hour: $rootScope.hours[1],
        minute: $rootScope.minutes[1],
        second: $rootScope.seconds[1]
      };
      $scope.training_date = {
        day: $rootScope.days[0],
        month: $rootScope.months[0],
        year: $rootScope.years[0],
        hour: $rootScope.hours[1],
        minute: $rootScope.minutes[1],
        second: $rootScope.seconds[1]
      };
      $scope.work_date = {
        day: $rootScope.days[0],
        month: $rootScope.months[0],
        year: $rootScope.years[0],
        hour: $rootScope.hours[1],
        minute: $rootScope.minutes[1],
        second: $rootScope.seconds[1]
      };
      $scope.work_hour = {
        hour: $rootScope.hours[1],
        minute: $rootScope.minutes[1]
      };
      $scope.country = country[13];
      $scope.countries = country;
      $scope.state = state[0];
      $scope.states = state;
    };
    $scope.reinitialize();

    $scope.toggleModelJobApp = function (index) {
      $scope.workDiaryPopupFlag = $rootScope.workDiaryPopupFlag = index;
      if ($rootScope.workDiaryPopupFlag === 1)
        $scope.jobApp.field_application_status = 0;
      if ($rootScope.workDiaryPopupFlag === 3)
        $scope.jobApp.field_course_status = 0;
      $scope.toggleState = !$scope.toggleState;
      $rootScope.error_msgs = [];
    };
    $scope.saveApplication = function () {
      $rootScope.error_msgs = [];
      $scope.loadingBar1 = true;

      if ($rootScope.workDiaryPopupFlag === 1) {
        $scope.jobApp.field_application_due_date = $scope.due_date.year.value + '-' + $scope.due_date.month.value + '-' + $scope.due_date.day.value;
        if ($scope.jobApp.field_employer === undefined)
          $rootScope.error_msgs.push("Employer Name Required");
        if ($scope.jobApp.field_job_title === undefined)
          $rootScope.error_msgs.push("Job Title Required");
        if (!$rootScope.isValidDate($scope.due_date.day.value, $scope.due_date.month.value, $scope.due_date.year.value))
          $rootScope.error_msgs.push("Invalid Application Due Date");
        if ($scope.jobApp.field_application_status === 0)
          $rootScope.error_msgs.push("Status Required");
        //if($scope.jobApp.field_notes===undefined)
        //$rootScope.error_msgs.push("Notes Required");
      }

      if ($rootScope.workDiaryPopupFlag === 2) {
        $scope.jobApp.field_interview_date_time = $scope.interview_date.year.value + '-' + $scope.interview_date.month.value + '-' + $scope.interview_date.day.value + " " + $scope.interview_date.hour.value + ":" + $scope.interview_date.minute.value + ":" + '00';//code for issue SR-71.
        if ($scope.jobApp.field_employer === undefined)
          $rootScope.error_msgs.push("Employer Name Required");
        if ($scope.jobApp.field_job_title === undefined)
          $rootScope.error_msgs.push("Job Title Required");
        if (!$rootScope.isValidDate($scope.interview_date.day.value, $scope.interview_date.month.value, $scope.interview_date.year.value))
          $rootScope.error_msgs.push("Invalid Interview Date");
        if ($scope.interview_date.hour.value === '' || $scope.interview_date.minute.value === '')
          $rootScope.error_msgs.push("Invalid Interview Time");
        if ($scope.jobApp.field_location != undefined) {
          $scope.jobApp.field_location.country = $scope.country.value;
          $scope.jobApp.field_location.administrative_area = $scope.jobApp.field_location.administrative_area.value;
        }
      }

      if ($rootScope.workDiaryPopupFlag === 3) {
        $scope.jobApp.field_training_date = $scope.training_date.year.value + '-' + $scope.training_date.month.value + '-' + $scope.training_date.day.value + " " + $scope.training_date.hour.value + ":" + $scope.training_date.minute.value + ":" + '00';//code for issue SR-73.
        if ($scope.jobApp.field_course_title === undefined)
          $rootScope.error_msgs.push("Course Title Required");
        if ($scope.jobApp.field_training_provider === undefined)
          $rootScope.error_msgs.push("Training Provider Name Required");
        if (!$rootScope.isValidDate($scope.training_date.day.value, $scope.training_date.month.value, $scope.training_date.year.value))
          $rootScope.error_msgs.push("Invalid Training Date");
        if ($scope.training_date.hour.value === '-1' || $scope.training_date.minute.value === '-1')  //add this code for issue SR-72
          $rootScope.error_msgs.push("Invalid Training Time");
        /*				if($scope.jobApp.field_location === undefined){
         $rootScope.error_msgs.push("Street Required");
         $rootScope.error_msgs.push("City Required");
         $rootScope.error_msgs.push("State Required");
         $rootScope.error_msgs.push("Postcode Required");
         $rootScope.error_msgs.push("Country Required");
         }
         else{
         $scope.jobApp.field_location.country = $scope.country.value;
         $scope.jobApp.field_location.administrative_area = $scope.jobApp.field_location.administrative_area.value;
         if($scope.jobApp.field_location.thoroughfare===undefined)
         $rootScope.error_msgs.push("Street Required");
         if($scope.jobApp.field_location.locality===undefined)
         $rootScope.error_msgs.push("City Required");
         if($scope.jobApp.field_location.administrative_area===undefined || $scope.jobApp.field_location.administrative_area==="")
         $rootScope.error_msgs.push("State Required");
         if($scope.jobApp.field_location.postal_code===undefined)
         $rootScope.error_msgs.push("Postcode Required");
         if($scope.jobApp.field_location.country===undefined)
         $rootScope.error_msgs.push("Country Required");
         }
         if($scope.jobApp.field_course_status===0)
         $rootScope.error_msgs.push("Course Status Required");
         if($scope.jobApp.field_notes===undefined)
         $rootScope.error_msgs.push("Notes Required"); remove all add below if code for issue SR-72*/
        if ($scope.jobApp.field_location != undefined) {
          $scope.jobApp.field_location.country = $scope.country.value;
          $scope.jobApp.field_location.administrative_area = $scope.jobApp.field_location.administrative_area.value;
        }
      }

      if ($rootScope.workDiaryPopupFlag === 4) {
        $scope.jobApp.field_work_date = $scope.work_date.year.value + '-' + $scope.work_date.month.value + '-' + $scope.work_date.day.value + " " + $scope.work_date.hour.value + ":" + $scope.work_date.minute.value + ":" + '00';//code for issue SR-74.
        $scope.jobApp.field_hours = $scope.work_hour.hour.value + ":" + $scope.work_hour.minute.value;

        if ($scope.jobApp.field_employer === undefined)
          $rootScope.error_msgs.push("Employer Name Required");
        if ($scope.jobApp.field_job_title === undefined)
          $rootScope.error_msgs.push("Job Title Required");
        if (!$rootScope.isValidDate($scope.work_date.day.value, $scope.work_date.month.value, $scope.work_date.year.value))
          $rootScope.error_msgs.push("Invalid Work Date");
        if ($scope.work_date.hour.value === '' || $scope.work_date.minute.value === '')
          $rootScope.error_msgs.push("Invalid Work Time");
        if ($scope.work_hour.hour.value === '' || $scope.work_hour.minute.value === '')
          $rootScope.error_msgs.push("Invalid Hours");
        /*if($scope.jobApp.field_notes===undefined)
         $rootScope.error_msgs.push("Notes Required");  remove this for issue SR-75*/
      }

      if ($rootScope.workDiaryPopupFlag === 5) {
        $scope.jobApp.field_work_date = $scope.work_date.year.value + '-' + $scope.work_date.month.value + '-' + $scope.work_date.day.value + " " + $scope.work_date.hour.value + ":" + $scope.work_date.minute.value + ":" + '00';//code for issue SR-76.

        if ($scope.jobApp.field_employer === undefined)
          $rootScope.error_msgs.push("Employer Name Required");
        if ($scope.jobApp.field_job_title === undefined)
          $rootScope.error_msgs.push("Job Title Required");
        if (!$rootScope.isValidDate($scope.work_date.day.value, $scope.work_date.month.value, $scope.work_date.year.value))
          $rootScope.error_msgs.push("Invalid Work Date");
        if ($scope.work_date.hour.value === '' || $scope.work_date.minute.value === '')
          $rootScope.error_msgs.push("Invalid Work Time");
        if ($scope.jobApp.field_wages === undefined || $scope.jobApp.field_wages == '')  //replace for issue SR-76
          $rootScope.error_msgs.push("Wages Required");
        else if ($scope.jobApp.field_wages.replace(/^[$]\d+(\.\d{1,2})?/g, '') !== '') //replace for issue SR-76
          $rootScope.error_msgs.push("Invalid Wages");
        /*if($scope.jobApp.field_notes===undefined)
         $rootScope.error_msgs.push("Notes Required");  remove this for issue SR-76*/
      }

      $scope.jobApp.field_work_diary_entry = $rootScope.workDiaryPopupFlag;
      $scope.jobApp.field_job_seeker = {};
      $scope.jobApp.field_job_seeker.target_id = $rootScope.users.profile.pid;
      var currentDate = new Date();
      $scope.jobApp.field_work_diary_date = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
      if ($rootScope.error_msgs.length === 0) {
        $scope.jobApp.$save().then(function () {
          $scope.reinitialize();
          $scope.loadingBar1 = false;
          $scope.toggleState = false;
        });
      }
      else {
        $scope.loadingBar1 = false;
      }
    };
  }
]);

srJobs.controller('myWorkHistoryController', ['$scope', '$rootScope', '$window', 'WorkDiary',
  function ($scope, $rootScope, $window, WorkDiary) {

    if ($window.localStorage.getItem('appType') !== 'home')
      $rootScope.locationRedirect('/');
    $scope.histories = [];

    $scope.loadingBar1 = true;
    $scope.histories = WorkDiary.query({
      sort_by: 'field_work_diary_date',
      sort_dir: 'DESC',
      limit: '25',
      offset: '0',
      api_key: $rootScope.users.api_token
    });
    $scope.histories.$promise.then(function () {
      $scope.loadingBar1 = false;
    });

  }
]);

srJobs.controller('notificationController', ['$scope', '$window', '$rootScope', 'Notification',
  function ($scope, $window, $rootScope, Notification) {

    if ($window.localStorage.getItem('appType') !== 'home')
      $rootScope.locationRedirect('/');

    $scope.loadingBar1 = true;
    $scope.notifications = Notification.query({api_key: $rootScope.users.api_token});
    $scope.notifications.$promise.then(function () {
      $scope.loadingBar1 = false;
    });

  }
]);
