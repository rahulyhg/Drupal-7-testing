launchpad.factory('ListUsers',function($resource){
	return $resource(API_URL + ':port/entity.json/personal/profile2/:pid?sort_by=field_first_name&condition[field_want_to_appear_in_director]=1&api_key=:api_key',
		{
			port:':' + API_PORT, api_key : API_KEY, pid : '@pid' 
		});
});

launchpad.factory('Topics',function($resource){
	return $resource(API_URL + ':port/entity.json/topics/simple?api_key=:api_key',
		{
			port:':' + API_PORT, api_key : API_KEY 
		});
});


launchpad.factory('UpdatedUser',function($resource){
	return $resource(API_URL + ':port/entity.json/personal/profile2/:pid?sort_by=field_first_name&api_key=:api_key',
		{
			port:':' + API_PORT, api_key : '@api_key', pid : '@pid' 
		});
});


//http methods


launchpad.factory('AuthService',function($http,Session){
	var authservice={};
	authservice.login = function(cred){
		return $http.post(API_URL+':'+API_PORT+'/account/login.json',cred,header).
		success(function(response){
			Session.pid = response.profile.pid;
			Session.uid = response.uid;
			Session.api_key = response.api_token;
		});
	};

	authservice.registerUser = function(newUserData){
		return $http
		.post(API_URL+':'+API_PORT+'/account/register.json?api_key='+API_KEY,newUserData,header).
		success(function(response){
			Session.pid = response.profile.pid;
			Session.uid = response.uid;
			Session.api_key = response.api_token;
		});
	};

	authservice.updateUser = function(updatedData){
		return $http
		.put(API_URL+':'+API_PORT+'/entity.json/personal/profile2/'+Session.pid+'?api_key='+Session.api_key,updatedData,header);
	};

	
	return authservice;
});

