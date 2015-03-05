imtrade.factory('DataService', function ($http, Session, SERVER_CREDENTIAL) {
	var dataService = {};
	
	dataService.getProfile = function () {
    return $http
        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/personal/profile2/'+Session.pid+'?api_key='
		+Session.api_key,SERVER_CREDENTIAL.header);
	};
	dataService.news = function () {
	return $http
        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/news/simple?sort_by=created&sort_dir=DESC&api_key='+Session.api_key,
            SERVER_CREDENTIAL.header);
	};
	
	dataService.listInvoice = function () {
    return $http
        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/invoice/simple?condition[field_invoice_to].[target_id]='+Session.uid
            +'sort_by=created&sort_dir=DESC&&api_key='+Session.api_key,
            SERVER_CREDENTIAL.header);
	};
	      
	
	dataService.listOrderItems = function (item) {
	return $http
        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/order_item/simple?condition[field_order_reference].[target_id]='+item+'&api_key='+Session.api_key,
            SERVER_CREDENTIAL.header);
	};      
	   
	dataService.listEnquiryById = function (msgId) {
	    return $http
	        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/message/simple/'+msgId+'?api_key='+Session.api_key,
	            SERVER_CREDENTIAL.header);
	};
	
	dataService.listThreadEnquiry = function (parentId) {
	    return $http
	        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/message/simple/?condition[field_thread].[target_id]='+parentId+'&api_key='+Session.api_key,
	            SERVER_CREDENTIAL.header);
	};
	
	dataService.loadUser = function (userId) {
	    return $http
	        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/personal/profile2/?condition[uid]='+userId+'&api_key='+Session.api_key,
	            SERVER_CREDENTIAL.header);
	};  
	
	dataService.loadAllUsers = function () {
	    return $http
	        .get(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/personal/profile2/?api_key='+Session.api_key,
	            SERVER_CREDENTIAL.header);
	};  
	
	dataService.postOrderItem = function (item , id) {
    return $http
        .post(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/order_item/simple?api_key='+Session.api_key,
            {
			"uid" : Session.uid,
			"field_order_reference" : {"target_id":id},
			"field_item_name" : item.name,
			"field_quantity" : item.qty,
			"field_units" : item.unit
			//"field_quoted_amount" : "15" //need to change according to design
			}, SERVER_CREDENTIAL.header);
	};

	dataService.updateOrderItemStatus = function (itemId) {
    return $http
        .put(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/order_item/simple/'+itemId+'?api_key='+Session.api_key,
            {
			"field_status_6" : "3"//Quote Confirmed
			}, SERVER_CREDENTIAL.header);
	};
	dataService.cancelOrderItemStatus = function (itemId) {
    return $http
        .put(SERVER_CREDENTIAL.url+':'+SERVER_CREDENTIAL.port+'/entity.json/order_item/simple/'+itemId+'?api_key='+Session.api_key,
            {
			"field_status_6" : "4"//Cancelled
			}, SERVER_CREDENTIAL.header);
	};
	return dataService;
});