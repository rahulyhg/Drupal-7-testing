launchpad.filter('UsrCat',function(){
	return function(input, x){
		var groups = [];
		for(var i = 0; i < input.length; i++) {
			var str = input[i].field_first_name.substring(0,1);
			 if(str == str.toLowerCase()) {
			   	str = str.toUpperCase();
			}
			
			if(str == x) {
			 	groups.push(input[i]);
			}
		}
		return groups;
	}
});