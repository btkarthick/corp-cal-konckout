var	log = log4javascript.getDefaultLogger();

var calendarModel = {}

var calendarViewModel = function(){
	
	var self = this;
	var date = new Date();
	
	self.allowedEventsPerCell = 3;
	
	self.currentMonth = ko.observable(date.getMonth());
	
	self.currentYear = date.getFullYear();
	
	self.allMonthsList =  [{"id" : "0", "name" : "January"} ,{"id" : "1", "name" : "February"},{"id" : "2", "name" : "March"},{"id" : "3", "name" : "April"},{"id" : "4", "name" : "May"},{"id" : "5", "name" : "June"},{"id" : "6", "name" : "July"},{"id" : "7", "name" : "August"},{"id" : "8", "name" : "September"},{"id" : "9", "name" : "October"},{"id" : "10", "name" : "November"},{"id" : "11", "name" : "December"}];
	
	self.eventsCategories = null;
	
	self.eventsCatIds = ko.observableArray();
		
	self.allYearsList = ["2013","2014","2015","2016"];
	
	self.eventsCatLength = ko.observable(null);
	
	self.currentCalendar = function(){
		
		var objCalendar = [];
		
		var objMonthList = calendarModel.Output.monthlist;
		
		var objEventsList = calendarModel.Output.events.year.Months;
		
		if(!$.isEmptyObject(objMonthList))
				
		{
			var currentListing = objMonthList[self.currentMonth()].Days;
			
			currentListing = currentListing.split(",");
			
			var objCurrentMonthEvents = objEventsList[self.currentMonth()].Days;
			
			
			
			$.each(currentListing , function(i, day){
				
				var day_split = day.split("_");
				
				var objEvents = {}
				
				objEvents["EventDay"] = day_split[1];
				
				objEvents["status"] = day_split[0];
				
				objEvents["Events"] = [];
				
					if(day_split[0] === "A")
					{

						$.each(objCurrentMonthEvents , function(j , objEvent){

							 if(day_split[1] === objEvent.EventDay)
							 {


								 if(!$.isEmptyObject(objEvent.Events))
								 {
									 //var counter = 0;	
									
									 $.each(objEvent.Events , function(k , eve){

									   if(self.eventsCatIds.indexOf(eve.EventTypeId) > -1)
									   {
											/*counter++;
										   
										   if(( counter > self.allowedEventsPerCell))
										   { return false;}*/
										   
										    objEvents["Events"].push(eve);
										   
										   

										}

									 });
								  }

								 else
								{
									objEvents["Events"] = [];
								}

							 }

						});
					
					}
		
				objCalendar.push(objEvents);
				
			});			
			
		}
	
		return(objCalendar);
	};
	
	
	self.eventTypesLabelClick = function(index , objEveCat){
		
		var eleCheckbox = "#checkbox-" + index;
		
		var flag = false;
		
		if($(eleCheckbox).is(":checked"))
		{
			
			self.eventsCatIds.remove(objEveCat.Guid);
			
			flag = false;
			
		}
		
		else
		{
			self.eventsCatIds.push(objEveCat.Guid);
			flag = true;
		}
		
		$(eleCheckbox).prop("checked" , flag).checkboxradio('refresh');
		
	};
	
	
	self.eventTypesSelectAll = function(){
		
		if($("#sel-all-chk-eve").is(":checked"))
		{
			self.eventsCatIds.removeAll();
			
			$("INPUT[name|='checkbox']").prop("checked" , false).checkboxradio("refresh");
			$("#sel-all-chk-eve").prop("checked" , true).checkboxradio("refresh");
		}
		
		else
		{
			 $("INPUT[name|='checkbox']").prop("checked" , true).checkboxradio("refresh");
			
			$("#sel-all-chk-eve").prop("checked" , false).checkboxradio("refresh");	
			
				var allIDs = [];
			
				$.each(self.eventsCategories , function(i , obj){

					allIDs.push(obj.Guid);
					

				});
			
				self.eventsCatIds.removeAll();
				
				self.eventsCatIds(allIDs);
				
		}
	}
	
}

// Create the object for our ViewModel

var calView = new calendarViewModel();

// End of oject creation


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


ko.bindingHandlers.jqmChecked = {
    init: function (element, valueAccessor, allBindings, bindingContext) {
		
		var eveCatID = ko.unwrap(valueAccessor());
		
		$(element).checkboxradio();
		
		$(element).on("change" , function(){
			
							
				if($(this).is(":checked"))
				{
					calView.eventsCatIds.push(eveCatID);
				}
			
				else
				{
					calView.eventsCatIds.remove(eveCatID);
				}
			
		});
	},
	
    update: function (element, valueAccessor) {
       
	      //refresh the element (for jquerymobile)
         $(element).prop("checked" , true).checkboxradio('refresh');
		
		
    }
}

ko.bindingHandlers.eventHideShow = {
	
	update : function(element, valueAccessor , allBindings, bindingContext){
		
		var currentIndex = parseInt(ko.unwrap(valueAccessor()));
		
		if(currentIndex > (calView.allowedEventsPerCell - 1))
			$(element).hide();
	} 
	
}

ko.bindingHandlers.jqmSelectAll = {
	
	init : function(element){ 
	
		$("#sel-all-chk-eve").checkboxradio();
	
	} ,
	
	
	update : function(element, valueAccessor , allBindings, bindingContext){
		
			var initailLength = parseInt(bindingContext.eventsCatLength());
		
			var currentLength = parseInt(bindingContext.eventsCatIds().length);
		
			var checkedFlag = (initailLength !== currentLength) ? false : true;
					
			$("#sel-all-chk-eve").prop("checked" , checkedFlag).checkboxradio("refresh");
			
			console.log(initailLength + " --- " + currentLength);
	}
	
}

