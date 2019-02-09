function DateString(day,month,year){
	this.day = day;
	this.month = month;
	this.year = year;
	this.dFront = "";
	if(this.day < 10) dFront = "0";
	this.mFront = "";
	if(this.month < 10) mFront = "0";
	this.stringForm = this.year+"-"+this.mFront+this.month+"-"+this.dFront+this.day;
	this.nextDay = function(){
		var days = [31,28,31,30,31,30,31,31,30,31,30,31];
		var day = this.day + 1;
		var month = this.month;
		var year = this.year;
		if(day > days[month-1]){
			day = 1;
			month ++;
		}
		if(month > 12){
			month = 1;
			year ++;
		}
		return new DateString(day,month,year);
	}
	this.sameDate= function(dateString){
		return dateString.day == this.day && dateString.month == this.month && dateString.year == this.year;
	}
	this.getRange = function (dateString){
		var days = [31,28,31,30,31,30,31,31,30,31,30,31];
		var currDate = new DateString(this.day,this.month,this.year);
		var count =0;
		while(!currDate.sameDate(dateString)){
			if(currDate.year < dateString.year -2){
				count += 365;
				currDate.year++;
			}else if(currDate.year < dateString.year || currDate.month < dateString.month){
				count+=days[(currDate.month+11) % 12];
				currDate.month++;
				if(currDate.month == 13){
					currDate.month = 1;
					currDate.year ++;
				}
			}else{
				count+= dateString.day-currDate.day;
				currDate.day = dateString.day;
			}
		}
		return count;
	}
}
var fromTo = [new DateString(1,7,2018),new DateString(6,2,2019)];

var started = 0;
var finished = 0;
function DataMine(){
	donePercentage = setInterval(getDonePercentage,500);
	var currentDate = new DateString(fromTo[0].day, fromTo[0].month, fromTo[0].year);
	while(!currentDate.sameDate(fromTo[1])){
		getDataForCurrentDate(currentDate);
		currentDate = currentDate.nextDay();
	}
}
function getDonePercentage(){
	if(started>0){
		var range = fromTo[0].getRange(fromTo[1]);
		if(finished < range){
			console.log((100.0*finished/range)+"%");
		}else{
			console.log("Done.");
			clearInterval(donePercentage);
		}
	}
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}
function getDataForCurrentDate(currentDate){
	started++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getDataInDom(turnToDom(xmlHttp.responseText));
			finished++;
        }
    }
    xmlHttp.onerror = function(){
    	console.log("Failed to get Data for "+currentDate.stringForm);
    	finished++;
    }
    xmlHttp.open("GET", "https://www.soccervista.com/soccer_games.php?date="+currentDate.stringForm, true); // true for asynchronous 
    xmlHttp.send(null);
}