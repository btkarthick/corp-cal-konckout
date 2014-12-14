var	log = log4javascript.getDefaultLogger();

var calendarModel = {}

var calendarViewModel = function(){
	
	var self = this;
	var date = new Date();
	
	self.currentDate = ko.observable(date.getMonth());
	
	self.currentYear = date.getFullYear();
	
	self.allMonthsList =  [{"id" : "0", "name" : "January"} ,{"id" : "1", "name" : "February"},{"id" : "2", "name" : "March"},{"id" : "3", "name" : "April"},{"id" : "4", "name" : "May"},{"id" : "5", "name" : "June"},{"id" : "6", "name" : "July"},{"id" : "7", "name" : "August"},{"id" : "8", "name" : "September"},{"id" : "9", "name" : "October"},{"id" : "10", "name" : "November"},{"id" : "11", "name" : "December"}];
	
	
	self.allYearsList = ["2013","2014","2015","2016"];
	

	self.currentCalendar = function(){
		
		var objDays = [];
		
		var objMonthList = calendarModel.Output.monthlist;
		
		if(!$.isEmptyObject(objMonthList))
				
		{
			var currentListing = objMonthList[self.currentDate()].Days;
		
			currentListing = currentListing.split(",");
		
			$.each(currentListing , function(i, day){
				
				var day_split = day.split("_");
				
					objDays.push({"status" : day_split[0] , "day" : day_split[1]});
				});
		}
	
		return(objDays);
	};
	
	
	
}


// Create the object for our ViewModel

var calView = new calendarViewModel();


var getCalendarData = function(){
	
	var URL = "JSON/" + calView.currentYear + ".json";
	
	$.ajax(URL , {
		
			dataType : "json" ,
		
			type : "GET",
		
			success : function(data){
				
				
				if(!$.isEmptyObject(data))
				{
					calendarModel = data;
					
					ko.applyBindings(calView);
			
				}
				
				
					
			},
		
			error: function(jqXHR, textStatus, errorThrown){
				
				log.fatal(errorThrown);
				log.error(errorThrown);
				log.debug(jqXHR);
			}
		
		
		
	});
	
}



var calendarInit = function(){
	
	getCalendarData(calView);
	
	$("#export_pop").on("click" , function(){
		
		calView.currentDate('10');
		
		$("#sel_month").selectmenu('refresh', true);
		
	});
	
}



$(document).on("ready" , calendarInit);