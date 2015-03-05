// create the controller and inject Angular's $scope

imtrade.controller("commonController", 
  function ($scope, $rootScope, ngDialog, AuthService, DataService, Session, $location, $routeParams, $upload, $window) {

  $rootScope.jsonData = '{"foo": "bar"}';
  $rootScope.theme = 'ngdialog-theme-default';
  
  //initializing rootScope.
  $rootScope.recentOrders = [];
  $rootScope.orders = [];
  $rootScope.invoices = [];
  $rootScope.newsPost = [];
  $rootScope.currentUser = {};

  //intializing scope variables
  $scope.rememberMe = true;
  $scope.loading = $scope.loading1 = false;
  $scope.errormsg = $scope.successmsg = false;
    
  //Current user profile
  $scope.userProfile = null; 
  $scope.welcomeUser = null;
  $scope.setUserProfile = function(profile){
    $scope.userProfile = profile;
	$scope.welcomeUser = profile.field_first_name+' '+profile.field_last_name;
	$scope.setUserSettingMenu();
  };
  
  //Setting current user.
  $scope.activeClass = '';
  $scope.setActiveClass = function(){
    $scope.activeClass = 'cmenu'; 
  };
  $rootScope.locationRedirect = function(pathVal){
	$location.path(pathVal);
  };
  //checking that user has manager or not.
  $scope.hasManager = function(){
	return ($rootScope.currentUser.profile.field_manager ? $rootScope.currentUser.profile.field_manager.target_id : null);
  };
  
  //get all user from back-end.
  $scope.allUsers =null; 
  $rootScope.getAllUsers = function(){
	  DataService.loadAllUsers().success(function (res) {
		  $scope.allUsers = res;	 
  	  });
  };
  

  //check that user has visit this message or not.
  $scope.visitedMsg = [];
  $scope.isVisitedMsg = function(msgId){
  var flag = true;
	  for(var i=0;i<$scope.visitedMsg.length;i++){
		  if($scope.visitedMsg[i].msgid === msgId){
			 flag = false;
			 break;
		  }
	  }
	  if(flag){
		 return "unread";
	  }else{return "read";}
	  
  };
  
  //setting unread message count.
  $scope.msgCount = 0;
  $scope.setMsgCount = function(){
	  $scope.msgCount = $scope.listEnquiry.length - $scope.visitedMsg.length;
  };
  
  //setting user name for message,news etc.
  $scope.name = '';
  $rootScope.setUserName = function(msgUserId){
	  for(var i=0;i<$scope.allUsers.length;i++){
		  if($scope.allUsers[i].uid === msgUserId){
			  $scope.name = $scope.allUsers[i].field_first_name+''+$scope.allUsers[i].field_last_name;
			  break;
		  }
	  }
	  return $scope.name;
  };

  //getting email
  $scope.email='';
  $scope.getUserMail=function(mailUserId){
    for(var i=0;i<$scope.allUsers.length;i++){
      if($scope.allUsers[i].uid === mailUserId){
        $scope.email = $scope.allUsers[i].field_email;
        break;
      }
    }
    return $scope.email;
  };
  
  //getting admin mobile no.
  $scope.adminnumber='';
  $scope.getAdmin=function(){
    for(var i=0;i<$scope.allUsers.length;i++){
      if($scope.allUsers[i].uid==1){
        $scope.adminnumber=$scope.allUsers[i].field_phone_mobile.number;
        break;
      }
    }
    return $scope.adminnumber;
  };
  //getting manager for running user, or any user whose manager is the running user.
  $scope.getToWhom = function(){
	  $scope.toWhom = []; 
	  for(var i=0;i<$scope.allUsers.length;i++){
		  var isMangaer = $scope.allUsers[i].field_manager ? $scope.allUsers[i].field_manager.target_id :null;
		  if($scope.allUsers[i].uid == $scope.hasManager() || isMangaer == $rootScope.currentUser.uid ){
			  $scope.toWhom.push($scope.allUsers[i]);
		  }
	  }
	  return $scope.toWhom;
  };
  
  
  //setting message listEnquiry that belong to a particular user.
  $scope.listEnquiry = [];

  $scope.setListEnquiry = function(listenquiry){
	  $scope.listEnquiry.length = 0;
	  for(var i=0;i<listenquiry.length;i++){
		  if(listenquiry[i].field_to.target_id == $rootScope.currentUser.uid || listenquiry[i].uid == $rootScope.currentUser.uid){
			  $scope.listEnquiry.push(listenquiry[i]);
		  }
	  }
  };
  
  //Expiring session value
  $scope.doSessionExpire = function(){
	Session.api_key = '';
	$scope.activeClass = '';
	$rootScope.isLogin = false;
	$rootScope.currentUser = {};
	$scope.errormsg = $scope.successmsg = false;
	$scope.loading = $scope.loading1 = false;
  };
  
  //Register user in dialogBox.   
  $scope.openUserregisterDailogBox = function () {
    $scope.errormsg = $scope.successmsg = false;
    $scope.value = true;
    ngDialog.close();

    ngDialog.open({
		template: 'views/user-register.html',
		scope: $scope
	});
  };

  //User registeration function
  $scope.newuser = {};
  $scope.newuser.instance = 'imtrade';
  $scope.newuser.data = {};
  
  $scope.newuser.data.profile = {};
  $scope.newuser.data.profile.field_manager = {};
  $scope.newuser.data.profile.field_phone_mobile = {};

  $scope.userRegister = function(form){
  $scope.newuser.data.profile.field_manager.target_id = '1';
  $scope.newuser.username = $scope.newuser.email;
    if(form.$valid) {
	     $scope.loading1 = true;
     //  AuthService.newUser($scope.newuser).success(function (res) {
			  // $scope.successmsg = "User created!";
			  // $scope.loading1 = false;
     //  }).error(function (error){
			  // $scope.errormsg ='Something went wrong!';
			  // $scope.loading1 = false;
     //  });
alert(JSON.stringify($scope.newuser));
    }else { 
        if(form.firstname.$invalid){
            $scope.errormsg ='Invalid first name.';
        }else if(form.lastname.$invalid){
            $scope.errormsg ='Invalid last name.';
        }else if(form.email.$invalid){
            $scope.errormsg ='Invalid email id.';
        }else if(form.phone.$invalid){
            $scope.errormsg ='Invalid phone number.';
        }else{
           $scope.errormsg ='password mismatch!.';
        }
    return;
	  }
  }; 
  
  
  //Forget password in dialogBox.
  $scope.openForgotpasswordDailogBox = function () {
    $scope.errormsg = $scope.successmsg = false;
    $scope.value = true;
    ngDialog.close();

    ngDialog.open({
		template: 'views/forgot-password.html',
		scope: $scope
	});
  };
  //ForgetPassword settings.
  $scope.resetPassword = function(form){
  	$scope.errormsg = $scope.successmsg = false;
	if(form.$valid){
		$scope.successmsg = 'Hi reset password link has been send to your email';
	}else{
		$scope.errormsg ='Invalid Email.';
	}
  };

  //New order in dialogBox.
  $scope.openNeworderTemplate = function () {
    $scope.errormsg = $scope.successmsg = false;
    $scope.value = true;

    ngDialog.open({
	  template: 'views/new-orders.html',
	  scope: $scope
	});
  };  
  
  //Edit profile in dialogBox
  $scope.editProfile = function() {
    $scope.errormsg = $scope.successmsg = false;
    $scope.value = true;

    ngDialog.open({
		template: 'views/edit-profile.html',
		controller: 'ngDialogController',
        scope: $scope
    });  
  };

  //SendEnquiry in dialogBox
  $scope.sendEnquiry = function() {
    $scope.errormsg = $scope.successmsg = false;
    $scope.value = true;

    ngDialog.open({
        template: 'views/send-enquiry.html',
		controller: 'ngDialogController',
        scope: $scope
    });  
  };
      
  //User menu setting
  $scope.setUserSettingMenu = function() {
    $scope.userSettingsMenu = 
    [
        {
            text: $scope.welcomeUser,
            href: '#/profile'
        }, {
            text: 'Profile',
            href: '#/profile'
        }, {
            divider: true
        }, {
            text: 'Log out',
            href: '#/logout'
        }
    ];
  };
  $scope.userSettingsMenuSelected = {};
  
  //Creating Order item.
  $scope.orderItem = {
        productname: "",
        quantity: "",
        unit: ""
  };
  $scope.order = [];
  $scope.newOrderItem = function(orderItem){
	$scope.errormsg = $scope.successmsg = false;
	if(orderItem.productname && orderItem.quantity && orderItem.unit) {
		$scope.order.push({
			name: orderItem.productname,
			qty : orderItem.quantity,
			unit: orderItem.unit
		});
    $scope.orderItem = {
        productname: "",
        quantity: "",
        unit: ""
    };
	}else {$scope.errormsg = "All fields are required!";}
  };
  
  //Remove item from order
  $scope.removeItem = function(index) {
	$scope.order.splice(index, 1);
  };
  
  //close New order dialogBox
  $scope.closeOrderPop = function(){
	ngDialog.close();
  };
  
  //posting Order and order item to server.
  $scope.item = {};
  $scope.orderdata = {};
  $scope.subminForQuote = function() {
	if($scope.order.length !=0){
	  $scope.loading1 = true;
		AuthService.postOrder($scope.orderdata).success(function (neworder) {
			$scope.oid = neworder.id;
			for (var i = 0, len = $scope.order.length; i < len; i++) {
			$scope.item = $scope.order[i];
				DataService.postOrderItem($scope.item, $scope.oid).success(function (newitem) {
					//do some thing if needed.
				})
				.error(function (error){
					$scope.errormsg ='Something went wrong!';
					$scope.loading1 = false;
				});
			}
			$scope.loading1 = false;
			$scope.successmsg = "Order created!"; 
			$scope.loading = true; 
			ngDialog.close();
      //$location.path('orders');
			AuthService.listOrder().success(function (orders) {
				$rootScope.orders = orders;
				$scope.loading = false;
      });
		})
		.error(function (error){
			$scope.loading1 = false;
			$scope.errormsg ='Something went wrong!';
		});
	}else {$scope.errormsg = "Please add some item!";}
  };
    
  //setting for attachment files
  $scope.onFileSelect = function($files) {
	    //$files: an array of files selected, each file has name, size, and type.
	  //alert(JSON.stringify($files));
  };
  
  //Send reply post setting.
  $scope.postreply = {};
  $scope.postreply.field_thread = {};
  $scope.postreply.field_to = {};
  $scope.sendEnquiryReply = function(form){	
  $scope.loading1 = true;
	if($routeParams.msgId){
		$scope.msgId = $routeParams.msgId;
		//alert($routeParams.msgId);
		DataService.listEnquiryById($scope.msgId).success(function (cmsg) {
			//alert(cmsg.id);
      $scope.postreply.field_thread.target_id = cmsg.id;
			$scope.postreply.field_subject = 'Re: '+cmsg.field_subject;
			$scope.postreply.field_to.target_id = cmsg.uid;
      //alert(JSON.stringify($scope.postreply));
			AuthService.enquiryPostReply($scope.postreply).success(function (res) {
				$scope.successmsg = "Enquiry sent!";
				$scope.loading1 = false;
				$location.path('msg-full-mode/'+$scope.msgId);
		    });
		});
	}
  };
});

//All others controller start from here
imtrade.controller("loginController", function ($scope, AuthService, $location, $cookies, $rootScope, SERVER_CREDENTIAL) {
	$scope.credentials = {};
	$scope.errormsg = $scope.successmsg =false;
	$scope.credentials = {
            username: $cookies.username?$cookies.username:'',
            password: $cookies.password?$cookies.password:''
    };
	$scope.setRememberMe = function(){
		$scope.rememberMe = !$scope.rememberMe ? true : false;
	};
	$scope.credentials.instance = SERVER_CREDENTIAL.instance;
    $scope.doLogin = function (form) {
    $scope.loading = true;
    $scope.errormsg =false;
    if($scope.rememberMe){
    	$cookies.username = $scope.credentials.username;
        $cookies.password = $scope.credentials.password;  
    }else {
    	$cookies.username = '';
        $cookies.password = '';
    }
		if(form.$valid) {
			AuthService.login($scope.credentials).success(function (user) {
				$rootScope.currentUser = user;
				$rootScope.getAllUsers();
				$rootScope.isLogin = true;
				$scope.setUserProfile(user.profile);
				$scope.loading = false;
				$location.path('/');
			})
			.error(function (error){
				$scope.errormsg ='Invalid username or password';
				$scope.loading = false;
			});
		}else {
			$scope.errormsg ='Invalid username or password';
			$scope.loading = false;
		}
    };
});

imtrade.controller("profileController", function ($scope, DataService, $location, $rootScope) {
    if(!$rootScope.isLogin){$scope.doSessionExpire();$location.path('/login');}
	$scope.errormsg = $scope.successmsg = false;
	DataService.getProfile().success(function (profile) {
    
		$scope.setUserProfile(profile);
    });
});

imtrade.controller("homeController", function ($scope, $location, AuthService, DataService, Session, ngDialog,$rootScope) {
    $scope.errormsg = $scope.successmsg = false;
    $scope.loading = true;
	$scope.loading1 = true;

    if($rootScope.isLogin && Session.api_key !=''){  
        $scope.setActiveClass();
        DataService.news().success(function (newspost) {
            $rootScope.newsPost = newspost;
			$scope.loading = false;
        });
        AuthService.listOrder().success(function (recentorders) {
            $rootScope.recentOrders = recentorders;
            //alert(JSON.stringify(recentorders));
			$scope.loading1 = false;
        });
        AuthService.listEnquiry().success(function (listenquiry) {
        	$scope.setListEnquiry(listenquiry);
        	$scope.setMsgCount();
        });
    }else {
        $scope.loading = false;
		$location.path('/login');
    }
});

imtrade.controller("orderdetailsController", function ($scope, $routeParams, DataService, $location,$rootScope,$http) {
    if(!$rootScope.isLogin){$scope.doSessionExpire();$location.path('/login');}
    $scope.loading = true;
	if($routeParams.orderId) {
	    $scope.orderId = $routeParams.orderId;
		DataService.listOrderItems($routeParams.orderId).success(function (res) {
		  $scope.items = res;
			$scope.loading = false;
		});
	}else { 
		$scope.errormsg ='Something went wrong!';
		$scope.loading = false;
	}
	$scope.getActiveClass = function(id){
		if(id == $routeParams.orderId){
		return 'active';
		}
	}

  $scope.cirfimOrderDetails = function(orderId,itemId){
    $scope.loading = true;
    DataService.updateOrderItemStatus(itemId).success(function (res) {
      $scope.order_info={
                    subject : 'Confirm order #'+orderId,
                    receiverName:$rootScope.currentUser.profile.label,
                    receiverEmail:$rootScope.currentUser.profile.field_email,
                    senderEmail:'noreply@agrimate.com.au',
                    senderName:'AgriMate Team',
                    message:'This is to inform you that you have conformed order #'+orderId
                    +' on Agrimate you can check details of your order by clicking http://agrimate.com.au/#/order-details/'+orderId,
                    msg_type :'order',
                    };

     //send mail to user when they confrirm qoted price.
     $http({
        method  :  "POST",
        url     :  "views/email.php",
        data    :  $.param($scope.order_info),
        headers :  { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(res){
        console.log(res);
      }).error(function(err){
        console.log(err);
      });

     $scope.loading = false;
    }).error(function(res){});
  };

  $scope.cancelOrderDetails = function(orderId,itemId){
    $scope.loading = true;
    DataService.cancelOrderItemStatus(itemId).success(function (res) {
      //add infomation if needed
      $scope.loading = false;
    }).error(function(res){});
  };
});

imtrade.controller("enquiriesController", function ($scope, AuthService, $location,$routeParams,$rootScope) {
    if(!$rootScope.isLogin){$scope.doSessionExpire();$location.path('/login');}
    $scope.loading = true;
    $scope.msgId = $routeParams.msgId;
    $scope.errormsg = $scope.successmsg = false;    
    AuthService.listEnquiry().success(function (listenquiry) {
    	$scope.setListEnquiry(listenquiry);
	    $scope.loading = false;
    });   
});

imtrade.controller("msgFullModeController", function ($scope, DataService, $location, $routeParams,$rootScope) {
  $scope.errormsg = $scope.successmsg =false;
  $rootScope.isReply = false;
    if(!$rootScope.isLogin){$scope.doSessionExpire();$location.path('/login');}   
	$scope.loading = true;
    if($routeParams.msgId) {
        $scope.msgId = $routeParams.msgId;
        if($scope.isVisitedMsg($scope.msgId)!='read'){$scope.visitedMsg.push({msgid:$scope.msgId});$scope.setMsgCount();}//checking for unread message.
        	DataService.listEnquiryById($scope.msgId).success(function (lmessage) {
                if(lmessage.field_thread!=null){
        			$scope.msgId = $routeParams.msgId = lmessage.field_thread.target_id;
        			DataService.listEnquiryById($scope.msgId).success(function (newlmessage) {
        				$scope.message = newlmessage;
						$scope.loading1 = true;
        				DataService.listThreadEnquiry(newlmessage.id).success(function (tmsg) {
        					$scope.threadMsg = tmsg;
							$scope.loading1 = false;
        				}); 
        			});
				}else{$scope.message = lmessage;}
				$scope.loading = false;
			});   
    }else {$scope.errormsg ='Something went wrong!';$scope.loading = false;}
    
    //setting for reply
    $scope.enquiryReply = function(){
    	$rootScope.isReply = !$rootScope.isReply ? true: false;
    };
});

imtrade.controller("ordersController", function ($scope, $location, AuthService,$rootScope) {
  $scope.errormsg = $scope.successmsg =false;
	$scope.loading = true;
    if($rootScope.isLogin) {
      AuthService.listOrder().success(function (orders) {
      	$rootScope.orders = orders;
			  $scope.loading = false;
      });
    }else { 
		$scope.doSessionExpire();
		$location.path('/login');
	}
});

imtrade.controller("invoicehistoryController", function ($scope, $location, DataService, $rootScope) {
	$scope.loading = true;
    if($rootScope.isLogin){
        DataService.listInvoice().success(function (res) {  
            $rootScope.invoices = res;
			$scope.loading = false;
        });
    }else { 
		$scope.doSessionExpire();
		$location.path('/login');
	}
});

imtrade.controller("logoutController", function ($scope, $location) {
    $scope.doSessionExpire();
    $location.path('/login');
});

imtrade.controller("ngDialogController", function($upload,$scope, AuthService, $rootScope, DataService,$routeParams, ngDialog,$http){
  $scope.errormsg = $scope.successmsg =false;
  $scope.loading = $scope.loading1 =false;
 
  //Update user profile function
    //alert(JSON.stringify($scope.userProfile));
  if($rootScope.isLogin){
  $scope.updatePF = {};
  $scope.updatePF.account = {};
  $scope.updatePF.field_phone_mobile = {};
  $scope.updatePF.field_address_3 = {};
  $scope.updatePF.field_first_name = $scope.userProfile.field_first_name;
  $scope.updatePF.field_last_name = $scope.userProfile.field_last_name;
  $scope.updatePF.field_phone_mobile.number = ($scope.userProfile.field_phone_mobile)? $scope.userProfile.field_phone_mobile.number :'';
  $scope.updatePF.field_email = $scope.userProfile.field_email;
  $scope.updatePF.field_abn = $scope.userProfile.field_abn;
  $scope.updatePF.field_preferred_transport = $scope.userProfile.field_preferred_transport;
  if($scope.userProfile.field_address_3){
    $scope.updatePF.field_address_3.country = $scope.userProfile.field_address_3.country;
    $scope.updatePF.field_address_3.thoroughfare = $scope.userProfile.field_address_3.thoroughfare;
    $scope.updatePF.field_address_3.premise = $scope.userProfile.field_address_3.premise;
    $scope.updatePF.field_address_3.locality = $scope.userProfile.field_address_3.locality;
    $scope.updatePF.field_address_3.administrative_area = $scope.userProfile.field_address_3.administrative_area;
    $scope.updatePF.field_address_3.postal_code = $scope.userProfile.field_address_3.postal_code;
    

  } else {
    $scope.updatePF.field_address_3 = '';
    $scope.updatePF.field_address_3.thoroughfare = '';
    $scope.updatePF.field_address_3.premise = '';
    $scope.updatePF.field_address_3.locality = '';
    $scope.updatePF.field_address_3.administrative_area = '';
    $scope.updatePF.field_address_3.postal_code = '';

  }
  $scope.updateUserProfile = function(form) {
	if(form.$valid){
		$scope.loading = true;
        AuthService.profileUpdate($scope.updatePF).success(function (res) {
			$scope.successmsg = "Profile updated!";
			$scope.loading = false;
			ngDialog.close();
			DataService.getProfile().success(function (profile) {
			$scope.setUserProfile(profile);
			$rootScope.getAllUsers();
			});
		})
		.error(function (error){
			$scope.errormsg ='Something went wrong!';
			$scope.loading = false;
		});  
	}else{	
	    if(form.firstname.$invalid){
            $scope.errormsg ='Invalid first name.';
        }else if(form.lastname.$invalid){
            $scope.errormsg ='Invalid last name.';
        }else if(form.email.$invalid){
            $scope.errormsg ='Invalid email id.';
        }else{
            $scope.errormsg ='Invalid phone number.';
        }
    return;    
	}
  };
  
  //Send enquiries function.  
  $scope.sendENQ = {};
  $scope.sendENQ.field_attachment={};
  $scope.uploadmsg = [];
  $scope.onFileSelect=function($files){
    $scope.uploadmsg.length = 0;
    $scope.files = $files;
    $scope.sendENQ.field_attachment=$scope.files[0].name;
    //alert($files[0].name);
    
  }
    
  $scope.mailData={};
  $scope.sendEnquiries = function(form){
    
    $scope.msgId = $routeParams.msgId;
    $scope.errormsg = $scope.successmsg = $scope.isReply = false;
    if(form.$valid) {
      // var file = $scope.files[0];
      // $scope.upload = $upload.upload({
      // headers:{'Content-Type': "multipart/form-data"},
      // method:'POST', 
      // url:'views/upload.php', 
      // file:file
      // }).
      // success(function(data){
      //   $scope.uploadmsg.push({msg:data});
        
      // }).
      // error(function(err){
      //   $scope.uploadmsg.push({msg:err});
        
      // });
      $scope.mailData={
                    subject : $scope.sendENQ.field_subject,
                    receiverName:$rootScope.setUserName($scope.sendENQ.field_to.target_id),
                    receiverEmail:$scope.getUserMail($scope.sendENQ.field_to.target_id),
                    senderEmail:$rootScope.currentUser.profile.field_email,
                    senderName:$rootScope.currentUser.profile.label,
                    message:$scope.sendENQ.field_message,
                    msg_type :'enquiries',
                    //attachment:$scope.files.name
                    };

      $scope.loading1 = true;

      AuthService.enquiryPost($scope.sendENQ).success(function (res) {
			$scope.successmsg = "Enquiry sent!";
      
      $http({
        method  :  "POST",
        url     :  "views/email.php",
        data    :  $.param($scope.mailData),
        headers :  { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(res){
        console.log(res);
      }).error(function(err){
        console.log(err);
      });
			$scope.loading1 = false;
			$scope.loading = true;
			ngDialog.close();
			AuthService.listEnquiry().success(function (listenquiry) {
				$scope.setListEnquiry(listenquiry);
				$scope.loading = false;
			});
      });
    }else { 
        if(form.to.$invalid){
            $scope.errormsg ='To field required.';
        }else if(form.subject.$invalid){
            $scope.errormsg ='Subject required.';
        }else {
            $scope.errormsg ='Message required.';
		}
    return;
	}
  }; 
  }else{
    $scope.doSessionExpire();
    $location.path('/login');
  } 
});