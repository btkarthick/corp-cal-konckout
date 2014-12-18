var calendarDataSuccess = function(data){
	
	if(!$.isEmptyObject(data))
	{
		calendarModel = data;

		calView.eventsCategories = calendarModel.Output.eventtypelist;
		
		getEventsCategoryIDs();
		
		ko.applyBindings(calView);
		
				
		$("#primary-left ul").listview("refresh");
		
		$("#primary-left ul").find("INPUT[type='checkbox']").prop("checked" , true);
	}
}

var getEventsCategoryIDs = function(){
	
	var arrIDs = [];
	
	$.each(calView.eventsCategories , function(i , obj){
		
		calView.eventsCatIds.push(obj.Guid);
				
	});
}

var calendarDataError = function(jqXHR, textStatus, errorThrown){
	
	log.fatal(errorThrown);
	log.error(errorThrown);
	log.debug(jqXHR);
}


var getCalendarData = function(){
	
	var URL = "JSON/" + calView.currentYear + ".json";
	
	$.ajax(URL , { success : calendarDataSuccess, error: calendarDataError});
}


var calendarInit = function(){

	getCalendarData(calView);
}


$(document).on("ready" , calendarInit);