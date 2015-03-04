

launchpad.controller("MainController",function($scope,$location,$rootScope,$window,Session,ListUsers,$anchorScroll,Topics){
	
	if($window.localStorage.getItem('user')!= null){
		$rootScope.currentUser = JSON.parse($window.localStorage.getItem('user'));
		Session.api_key = $rootScope.currentUser.api_token;
		Session.pid = $rootScope.currentUser.profile.pid;
		Session.uid = $rootScope.currentUser.uid;
		
	};
	if($window.localStorage.getItem('profile')!=null){
		$rootScope.profile = JSON.parse($window.localStorage.getItem('profile'));

	};
	
	$scope.loading = '';
	
    $scope.getAnim = function(){
		if(checkPathForAnim($location.path()))
			return;
		return 'view-slide-in';
	}
	// get all users
	$rootScope.allUsers = {};
	$rootScope.allUsers = ListUsers.query();

	//get all topics (terms)

	$rootScope.topics = Topics.query();


    //Used this array to form select list for field im intrested in , experienced in.
	$scope.vocabTag = [
      {label: "- None -", value: "0"},
      {label: "Education", value: "1"},
      {label: "Business", value: "2"},
      {label: "Investment", value: "3"}
    ];

	// get user by Category (Experience)

	$scope.getCategoryUserByExperience = function(tid){
		$scope.categoryUserByExperience = [];
		$scope.categoryUserByExperience.length = 0;
		for(var i=0;i<$rootScope.allUsers.length;i++){

			if($rootScope.allUsers[i].field_ask_me_about_6){
				for (var j = 0; j < $rootScope.allUsers[i].field_ask_me_about_6.length; j++) {				
				  if($rootScope.allUsers[i].field_ask_me_about_6[j] == tid){
					$scope.categoryUserByExperience.push({pid : $rootScope.allUsers[i].pid,
													label : $rootScope.allUsers[i].label,
													photo : $rootScope.allUsers[i].field_website_profile_photo ? $rootScope.allUsers[i].field_website_profile_photo.filename : ''
													});
					break;
				  }
			    };
			}
		}
		
		return $scope.categoryUserByExperience;
	};
	

	// get user by category (interest)

	$scope.getCategoryUserByInterest = function(tid){
		$scope.categoryUserByInterest = [];
		$scope.categoryUserByInterest.length = 0;
		for(var i=0;i<$rootScope.allUsers.length;i++){

			if($rootScope.allUsers[i].field_i_m_interested_in_5){
				for (var j = 0; j < $rootScope.allUsers[i].field_i_m_interested_in_5.length; j++) {				
				  if($rootScope.allUsers[i].field_i_m_interested_in_5[j] == tid){
					$scope.categoryUserByInterest.push({pid : $rootScope.allUsers[i].pid,
													label : $rootScope.allUsers[i].label,
													photo : $rootScope.allUsers[i].field_website_profile_photo ? $rootScope.allUsers[i].field_website_profile_photo.filename : ''
													});
					break;
				  }
			    };
			}
		}
		return $scope.categoryUserByInterest;
	};

	//navigate to path

	$scope.locationRedirect = function(url){
		$location.path(url);
	};

	//expires current user session

	$scope.doSessionExpire = function(){
		$rootScope.currentUser = '';
		$rootScope.profile = '';
		$rootScope.profile = '';
		$window.localStorage.clear();
	};	
	
	

	//get user name's first character(Distinct)
	
	$scope.checkDistinct = function(str){
		var flag = 0;
		
	 	for(var j=0;j<$scope.initialChar.length;j++){
	 		
	 	 	if($scope.initialChar[j].label==str.toUpperCase()){
	 	 		flag = 1;
	 	 	}
	 	 	
	 	}
	 	if(flag == 0){
	 		$scope.initialChar.push({value:str.toLowerCase(),label:str.toUpperCase()});
	 	}
	 	return $scope.initialChar;
	 	
	}


	$scope.initialChar=[];

	$scope.getInitial = function(allUsers){
		$scope.initialChar.length = 0;
		for(var i=0;i<allUsers.length;i++){
			if(i==0){
				$scope.initialChar.push({value:allUsers[i].field_first_name.charAt(0).toLowerCase(),label:allUsers[i].field_first_name.charAt(0).toUpperCase()});
			} else {
				$scope.checkDistinct(allUsers[i].field_first_name.charAt(0));
			}			
		}
		
		return $scope.initialChar;
	};

	// setting user profile
	
	$scope.setUserProfile = function(currentUser){
		$rootScope.profile = currentUser.profile;
	};

	// Scroll to top position
	$scope.scrollTop = function(ids){
		var olds = $location.hash();
  		$location.hash(ids);
	 	$anchorScroll();
  		$location.hash(olds);

	};

	//setting update data config on Update Profile

	$scope.setDataToUpdate = function(data){
		for (var i = 0; i < data.length; i++) {
			if(data[i].value == 0){
				continue;
			}else{
				$scope.newVar = data[i].value;
				break;//now for single value further will alter.
			}
			
		};
		return $scope.newVar;
	};

	
	// Display user Interest and Experience in user Detail and Experience page
     $rootScope.setUserChoice = function(arrids){
		$scope.choiceLabel = [];
		for (var i = 0; i < arrids.length; i++) {
     		
     		for(var j=1;j<=$scope.vocabTag.length;j++){
			  if($scope.vocabTag[j].value == arrids[i]){
				$scope.choiceLabel.push({label : $scope.vocabTag[j].label,
									id : $scope.vocabTag[j].value
									});
				break;
			  }
		    }
		};
		return $scope.choiceLabel;
	};

	// To display Category Label

	$scope.setCategoryLabel = function(tid){
		$scope.name = '';
		for(var i=0;i<$scope.vocabTag.length;i++){
			if($scope.vocabTag[i].value == tid){
				$scope.name = $scope.vocabTag[i].label;
				break;
			}
		}
		return $scope.name;
	};


	// setting Active Class


	$scope.NameClass = '';
	$scope.exClass='';
	$scope.setActiveClass = function(id){
		if(id == 1){
			$scope.NameClass = 'active';
			$scope.exClass = '';
			return $scope.NameClass;
		} else if(id == 2){
			$scope.exClass = 'active';	
			$scope.NameClass = '';
			return $scope.exClass;
		}
		
	};


	// to check User Availability

	$scope.isUserFound = function(label){
		var flag = 0;
		for(var i=0;i<$rootScope.allUsers.length;i++){
			var str = $rootScope.allUsers[i].field_first_name.charAt(0);
			if(str == str.toLowerCase()){
			 	str = str.toUpperCase();
			}
			if(str == label){
			 	flag = 1;
				break;
			}
		}
		if(flag == 1){
			return false;
		} else {
			return true;
		}
	};

});


launchpad.controller("HomeController",function($scope,$rootScope,ListUsers,$location,$anchorScroll){
	$scope.setActiveClass(1);
	$scope.loading = true;
	$scope.characters = alphabets;
	$rootScope.allUsers = ListUsers.query();
	$rootScope.allUsers.$promise.then(function(){
		$scope.getInitial($rootScope.allUsers);
		$scope.loading = false;	
	});

	

});

launchpad.controller("ExpController",function($scope,$rootScope,ListUsers){
	$scope.setActiveClass(2);
	$scope.loading = true;
	$rootScope.allUsers = ListUsers.query();
	$rootScope.allUsers.$promise.then(function(){
		$scope.groupBy();
		$scope.loading = false;
	});

    //Group all user by category ids	
	$scope.groupBy = function(){
		$scope.cate = [];
		for(var j=1;j<$scope.vocabTag.length;j++){
				$scope.cate.push({label:$scope.vocabTag[j].label,
					ids : $scope.vocabTag[j].value,
					users:[]
					});
		}
		
		for(var i=0;i<$scope.cate.length;i++){
			var group = $scope.cate[i]; 
		    for(var j=0;j<$rootScope.allUsers.length;j++){
				if($rootScope.allUsers[j].field_ask_me_about_6){
					for (var k = 0; k < $rootScope.allUsers[j].field_ask_me_about_6.length; k++) {
                      if($rootScope.allUsers[j].field_ask_me_about_6[k] == $scope.cate[i].ids){
						$scope.cate[i].users.push($rootScope.allUsers[j]);                      	
                      }
					}
				}
			}
		}
	}
	
});

launchpad.controller('UserDetailController',function($scope,$routeParams,ListUsers,$rootScope){
	$scope.loading = true;
	$scope.userUid = $routeParams.uid;
	$scope.reqUser = ListUsers.get({pid:$scope.userUid});
	$scope.reqUser.$promise.then(function(){

		if($scope.reqUser.field_ask_me_about_6){
			$scope.Exp = $rootScope.setUserChoice($scope.reqUser.field_ask_me_about_6);
		}
		if($scope.reqUser.field_i_m_interested_in_5){
			$scope.Int = $rootScope.setUserChoice($scope.reqUser.field_i_m_interested_in_5);
		}
		$scope.loading = false;
	});

	
	

});

launchpad.controller("LoginController",function($scope,$cookies,AuthService,$rootScope,$window){
	
	$scope.credentials = {};
	$scope.errormsg = '';
	$scope.rememberMe = true;
	$scope.credentials = {
		username : $cookies.username ? $cookies.username : '',
		password : $cookies.password ? $cookies.password : '',
	};

	$scope.setRememberMe = function() {
		$scope.rememberMe = $scope.rememberMe ? true : false;
	};

	$scope.doLogin = function(form) {
		if(form.$valid) {
			$scope.loading = true;
			if($scope.rememberMe) {
				$cookies.username = $scope.credentials.username;
				$cookies.password = $scope.credentials.password;
			}
			else {
				$cookies.username='';
				$cookies.password='';
			}
			$scope.credentials.instance = instance;


			AuthService.login($scope.credentials).success(function(data){

				$rootScope.currentUser = data;
				$window.localStorage.setItem('user',JSON.stringify($rootScope.currentUser));
				$window.localStorage.setItem('profile',JSON.stringify($rootScope.currentUser.profile));
				$scope.setUserProfile($rootScope.currentUser);
				$scope.errormsg = '';
				$scope.locationRedirect('profile');
			}).error(function(error){
				$scope.errormsg = 'Username or Password is incorrect';
				$scope.loading = false;
			});

		} else {
			$scope.errormsg = 'Invalid Username or Password';
		}
	};
});

launchpad.controller("LogoutController",function($scope) {
	$scope.doSessionExpire();
	$scope.locationRedirect('/');
	
});

launchpad.controller("SignupController",function($scope,AuthService,$rootScope,$window) {
	
	$scope.newUser = {};
	$scope.user = {};
	$scope.userChoice = true;
	$scope.newUser.data = {};
	$scope.newUser.data.profile = {};
	$scope.errormsg = [];
	$scope.successmsg = '';
	

	$scope.userRegister = function(form){
		$scope.scrollTop('idRegisterTop');
		$scope.errormsg.length = 0;
		if(form.$valid){
			if($scope.user.email == $scope.user.email_confirm){
				
				$scope.loading = true;
				$scope.newUser.email = $scope.user.email;
				$scope.newUser.instance = instance;
				$scope.newUser.username = $scope.user.email;
				$scope.newUser.data.roles = 1;
				$scope.newUser.data.profile.field_want_to_appear_in_director = $scope.userChoice;
										
				AuthService.registerUser($scope.newUser).success(function(res){
					$rootScope.currentUser = res;
					$window.localStorage.setItem('user',JSON.stringify($rootScope.currentUser));
					$window.localStorage.setItem('profile',JSON.stringify($rootScope.currentUser.profile));
					$scope.setUserProfile($rootScope.currentUser);
					$scope.successmsg = 'Registered Successfully';
					$scope.errormsg.length = 0;
					$scope.loading = false;
					$scope.locationRedirect('profile');
				})
				.error(function(err){
				 	$scope.errormsg.push({label:'User Creation failed.. Please Try Again'});
				 	$scope.successmsg = '';
				 	$scope.loading = false;
				});
			} else {
				$scope.errormsg.push({label:'Your email addresses do not match. Please check and confirm your email address'});
			}
		}
		else {
			$scope.successmsg = '';
			if(form.first_name.$invalid){
				$scope.errormsg.push({label:'Enter valid First Name'});
			} if(form.last_name.$invalid){
				$scope.errormsg.push({label:'Enter valid Last Name'});
			} if(form.email.$invalid){
				$scope.errormsg.push({label:'Invalid Email'});
			} if(form.email_confirm.$invalid){
				$scope.errormsg.push({label:'Your email addresses do not match. Please check and confirm your email address'});
			} if(form.password.$invalid){
				$scope.errormsg.push({label:'Empty Password'});
			}
		}
	}
	
});

launchpad.controller("ProfileController",function($scope,$window,$rootScope) {
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('users/login');
	}
	if($rootScope.profile.field_ask_me_about_6){
			$scope.Exp = $rootScope.setUserChoice($rootScope.profile.field_ask_me_about_6);
	}
	if($rootScope.profile.field_i_m_interested_in_5){
			$scope.Int = $rootScope.setUserChoice($rootScope.profile.field_i_m_interested_in_5);
	}
	
});

launchpad.controller("EditProfileController",function($scope,$rootScope,$window,AuthService,UpdatedUser,ListUsers) {
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('users/login');
	};
	$scope.successmsg = '';
	$scope.errormsg = '';
	$scope.updatePF = {};
	$scope.editUser = {};
	$scope.profileUpdate = {};
	

	$scope.updatePF.field_first_name = $rootScope.profile.field_first_name;
	$scope.updatePF.field_last_name = $rootScope.profile.field_last_name;
	$scope.updatePF.field_linkedin = $rootScope.profile.field_linkedin;
	$scope.updatePF.field_website_1 = $rootScope.profile.field_website_1;
	$scope.updatePF.field_organisation = $rootScope.profile.field_organisation;
	$scope.updatePF.field_want_to_appear_in_director = $rootScope.profile.field_want_to_appear_in_director;
	
	$scope.editUser.field_i_m_interested_in = [];
	$scope.editUser.field_ask_me_about = [];

	
	//for new field i_m_interested_in
    if ($rootScope.profile.field_i_m_interested_in_5 === null && $rootScope.profile.field_ask_me_about_6 === null) {
      $scope.temp_interested_in = [];
      $scope.temp_ask_me_about = [];
    }
    else {
      $scope.temp_interested_in = $rootScope.profile.field_i_m_interested_in_5;
      $scope.temp_ask_me_about = $rootScope.profile.field_ask_me_about_6;

    }
    $scope.availabilityCheck = function () {
      for (var i = 0; i < $scope.temp_interested_in.length; i++){
      	$scope.editUser.field_i_m_interested_in.push({value:$scope.temp_interested_in[i]});
      }
      for (var i = 0; i < $scope.temp_ask_me_about.length; i++){
      	$scope.editUser.field_ask_me_about.push({value:$scope.temp_ask_me_about[i]});
      }
    };

    $scope.availabilityCheck();  
	
	$scope.updatePF.field_twitter = {};
	if($rootScope.profile.field_twitter){
		$scope.updatePF.field_twitter.twitter_username = $rootScope.profile.field_twitter.twitter_username;
	} else {
		$scope.updatePF.field_twitter = null;
	}
		
	$scope.updateUserProfile = function(editProfile){
		$scope.scrollTop('idTop');
		if(editProfile.$valid){
			$scope.errormsg = '';
			$scope.successmsg = '';
			$scope.loading = true;
			
			 $scope.updatePF.field_i_m_interested_in_5 = $scope.setDataToUpdate($scope.editUser.field_i_m_interested_in);
			 $scope.updatePF.field_ask_me_about_6 = $scope.setDataToUpdate($scope.editUser.field_ask_me_about);
			AuthService.updateUser($scope.updatePF).success(function(res){
		     	$rootScope.profile = UpdatedUser.get({pid:$rootScope.currentUser.profile.pid,api_key:$rootScope.currentUser.api_token});
		     	$rootScope.profile.$promise.then(function(){
		     		$window.localStorage.setItem('profile',JSON.stringify($rootScope.profile));
		     		$scope.successmsg = 'Profile updated Successfully';
		 			$scope.errormsg = '';
		 			$scope.loading = false;
		 			$scope.locationRedirect('profile');
		     	});
		     	
			 }).error(function(err){
			   	$scope.errormsg = 'Updation Failed';
			   	$scope.loading = false;
			});
		 	
		} else {
			$scope.successmsg = '';
			if(editProfile.firstname.$invalid){
		 		$scope.errormsg = 'first name Required';
		 	} else if(editProfile.lastname.$invalid){
		 		$scope.errormsg = 'last name Required';
		 	}
		}
	}


});

launchpad.controller('ForgotPasswordController',function($scope){
	$scope.forgot = {};
	$scope.errormsg = '';
	$scope.successmsg = '';
	$scope.SendForgotMail = function(forgotForm){
		if(forgotForm.$valid){
			$scope.successmsg = 'Email sent !!';
			$scope.errormsg = '';
		} else{
			$scope.errormsg = 'Invalid Email Address';
			$scope.successmsg = '';
		}
	}
});


launchpad.controller('ContactController',function($scope,$routeParams,UpdatedUser,$http,$rootScope){
	$scope.loading = true;
	$scope.mailData = {};
	$scope.contactUser = UpdatedUser.get({pid:$routeParams.pid,api_key:API_KEY});
	$scope.contactUser.$promise.then(function(){
	 	$scope.mailData.mailTo = $scope.contactUser.field_first_name+' '+$scope.contactUser.field_last_name;
	 	$scope.mailData.email = $scope.contactUser.mail;
	 	$scope.mailData.sender = $rootScope.profile.mail;
	 	$scope.loading = false;
	});
	$scope.errormsg = '';
	$scope.successmsg = '';
	$scope.sendMail = function(contactForm){
		if(contactForm.$valid){
			$scope.loading = true;
			$http({
			method : "POST",
			url : "views/email.php",
			data : $.param($scope.mailData),
			headers :  { 'Content-Type': 'application/x-www-form-urlencoded' }

		}).success(function(res){
			$scope.successmsg = 'E-Mail sent to '+$scope.mailData.mailTo;
			//console.log(res);
			// $scope.successmsg = res.message+' to '+$scope.mailData.mailTo;
			// $scope.errormsg = '';
			$scope.loading = false;

		}).error(function(err){
			$scope.errormsg = 'E-Mail not sent ';
			//console.log(err);

			// $scope.errormsg = err.message+' Please try again..!';
			// $scope.successmsg = '';
			$scope.loading = false;
		});
		

			
		} else {
			$scope.successmsg ='';
			if(contactForm.mailTo.$invalid){
				$scope.errormsg = 'Invalid Email address..';
			} else if(contactForm.mailBody.$invalid){
				$scope.errormsg = 'Message Body Empty..';

			}
		}
	}
});

launchpad.controller('CategoryDetailController',function($scope,$routeParams,$rootScope,ListUsers){
	
	$scope.loading = true;
	$scope.catId = $routeParams.tid;
	$rootScope.allUsers = ListUsers.query();
	$rootScope.allUsers.$promise.then(function(){
		$scope.getCategoryUserByExperience($scope.catId);
		$scope.getCategoryUserByInterest($scope.catId);
        $scope.loading = false;
	});

});

launchpad.controller('UserByNameController',function($scope,$routeParams,$rootScope,ListUsers){
	
	$scope.characters = alphabets;
	$scope.filterVal = angular.uppercase($routeParams.char);	
	
});