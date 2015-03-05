imtrade.factory('AuthService', function ($http, Session, SERVER_CREDENTIAL, $filter, ngDialog) {

	var authService = {};
	
	var today = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
	
   authService.login = function (credentials) {
      return $http
	.post(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/account/login.json',credentials, SERVER_CREDENTIAL.header)
        .success(function(response) {
            Session.api_key = response.api_token;
            Session.uid = response.uid; 
            Session.pid = response.profile.pid;
            Session.managerId = response.profile.field_manager.target_id;
            return response;
        });
   };  
        
   authService.newUser = function (newuserdata) {
      return $http
       	.post(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/personal/profile2?api_key='
            +SERVER_CREDENTIAL.api_token, newuserdata, SERVER_CREDENTIAL.header);
   };
  
   authService.profileUpdate = function (userProfile) {
      return $http
        .put(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/personal/profile2/'+Session.pid+'?api_key='+Session.api_key,
         userProfile,SERVER_CREDENTIAL.header);
   };
  
   authService.enquiryPost = function (enquirydata) {
      return $http
        .post(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/message/simple?api_key='+Session.api_key,
         enquirydata, SERVER_CREDENTIAL.header);
      
   };
	
   authService.enquiryPostReply = function (postreply) {
      return $http
	  .post(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/message/simple?api_key='+Session.api_key,
	   postreply, SERVER_CREDENTIAL.header);
   };
	
   authService.postOrder = function (order) {
    return $http
      .post(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/order/simple?api_key='+Session.api_key,
         {
			"uid" : Session.uid,
			"field_date_4": today,
			"field_status": "3",
			"field_order_name": order.name,
			"field_order_notes": order.notes
		 }, SERVER_CREDENTIAL.header);
   };
	
   authService.listEnquiry = function () {
      return $http
        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/message/simple?sort_by=changed&sort_dir=DESC&api_key='
         +Session.api_key, SERVER_CREDENTIAL.header);
   };  
	
   authService.listOrder = function () {
      return $http
        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/order/simple?condition[uid]='
	 +Session.uid+'&sort_by=created&sort_dir=DESC&api_key='+Session.api_key,SERVER_CREDENTIAL.header);
   };  
   //register new user account.
   authService.registerUser = function(newuserdata){
    return $http
      .post(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/account/register.json',newuserdata, SERVER_CREDENTIAL.header);
   }
   return authService;
});
