var	log = log4javascript.getDefaultLogger();

var calendarModel = {}

var calendarViewModel = function(){
	
	var self = this;
	var date = new Date();
	
	self.currentMonth = ko.observable(date.getMonth());
	
	self.currentYear = date.getFullYear();
	
	self.allMonthsList =  [{"id" : "0", "name" : "January"} ,{"id" : "1", "name" : "February"},{"id" : "2", "name" : "March"},{"id" : "3", "name" : "April"},{"id" : "4", "name" : "May"},{"id" : "5", "name" : "June"},{"id" : "6", "name" : "July"},{"id" : "7", "name" : "August"},{"id" : "8", "name" : "September"},{"id" : "9", "name" : "October"},{"id" : "10", "name" : "November"},{"id" : "11", "name" : "December"}];
	
	
	self.allYearsList = ["2013","2014","2015","2016"];
	
	self.currentCalendar = function(){
		
		var objDays = [];
		
		var objMonthList = calendarModel.Output.monthlist;
		
		if(!$.isEmptyObject(objMonthList))
				
		{
			var currentListing = objMonthList[self.currentMonth()].Days;
		
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

// End of oject creation


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
	
	/*$("#export_pop").on("click" , function(){
		
		calView.currentMonth('10');
		
		$("#sel_month").selectmenu('refresh', true);
		
	});*/
	
}



$(document).on("ready" , calendarInit);

/* KO's custom binding for previous button
 * 
 * Wll be call each month change from - Selectbox, buttons click
 */ 

ko.bindingHandlers.jqmPrevButton = {
	
	init: function(element, valueAccessor, allBindings, bindingContext){
		
		$(element).on("click" , function(){
			
			var cmonth = bindingContext.currentMonth();
			
			bindingContext.currentMonth(parseInt(cmonth) - 1);
						
		});
		
	} ,
	
	
	update : function(element, valueAccessor, allBindings, bindingContext) {
        
		// This will be called once when the binding is first applied to an element,
        // and again whenever any observables/computeds that are accessed change
        // Update the DOM element based on the supplied values here.
		
		var offset = parseInt(bindingContext.currentMonth()) - 1;
		
		log.debug("prev " + offset);
		
		var liEle = $(element).parents("li.calendar_nav");
		
		if(offset > -1){
				
				var prevText = bindingContext.allMonthsList[offset].name.substring(0,3);
				
				$(liEle).show();
			
				$(element).text(prevText).button("refresh");
			}
		
			else{
				  $(liEle).hide();	
			}
     }
}


/* KO's custom binding for next button
 * 
 * Wll be call each month change from - Selectbox, buttons click
 */

ko.bindingHandlers.jqmNextButton = {
	
	
	init: function(element, valueAccessor, allBindings, bindingContext){
		
		$(element).on("click" , function(){
			
			var cmonth = bindingContext.currentMonth();
			
			bindingContext.currentMonth(parseInt(cmonth) + 1);
					
		});
		
	} ,
	
	
	update : function(element, valueAccessor, allBindings, bindingContext) {
        
		// This will be called once when the binding is first applied to an element,
        // and again whenever any observables/computeds that are accessed change
        // Update the DOM element based on the supplied values here.
	
		var offset = parseInt(bindingContext.currentMonth()) + 1;
		
		var liEle = $(element).parents("li.calendar_nav");
		
		if(offset < 12){
			
			var nextText = bindingContext.allMonthsList[offset].name.substring(0,3);

			$(liEle).show();

			$(element).text(nextText).button("refresh");
			
		}
		
		else{
			$(liEle).hide();
		}
		
    }

	
}