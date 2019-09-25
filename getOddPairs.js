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
var fromTo = [new DateString(1,7,2018),today()];
var started = 0;
var finished = 0;
var done = false;
function DataMine(){
	started = 0;
	finished = 0;
	done = false;
	donePercentage = setInterval(getDonePercentage,500);
	var currentDate = new DateString(fromTo[0].day, fromTo[0].month, fromTo[0].year);
	while(!currentDate.sameDate(fromTo[1])){
		getDataForCurrentDate(currentDate);
		currentDate = currentDate.nextDay();
	}
	getDataForCurrentDate(currentDate);
}
function getDonePercentage(){
	if(started>0){
		var range = fromTo[0].getRange(fromTo[1]);
		if(finished < range){
			console.log((100.0*finished/range)+"%");
		}else{
			console.log("Done.");
			done=true;
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
            getDataInDom(turnToDom(xmlHttp.responseText),currentDate);
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
var testData = [];
var trainingData = [];
function today(){
	var d = new Date();
	return new DateString(d.getDate(),d.getMonth()+1, d.getFullYear())
}
function getDataInDom(dom,date){
	var table = getTable(dom);
	var rows = getRows(table);
	var currentLeague;
	for(r in rows){
		if( rows[r].className == "onem" || rows[r].className == "twom"){
			var odd1 = getOdd(rows[r],0);
			//console.log(odd1);
			if(!odd1 || odd1 == "") continue;
			var oddX = getOdd(rows[r],1);
			//console.log(oddX);
			if(!oddX || oddX == "") continue;
			var odd2 = getOdd(rows[r],2);
			//console.log(odd2);
			if(!odd2 || odd2 == "") continue;
			if(fromTo[1].sameDate(date))
				testData.push(new item(getMatch(rows[r]), odd1, oddX, odd2, "").stringifyAsTestData());
			else{
				var match = getMatch(rows[r])
				var result = findResult(rows[r]);
			//console.log(result);
				if(!match || !result || result == "-:-") continue;
				trainingData.push(new item("",odd1, oddX, odd2, getScore(result)).stringifyAsTrainingData());
			}
		}
				
	}
}
function getTable(dom){
	return dom.getElementsByTagName("tbody")[0];
}
function getRows(table){
	return table.getElementsByTagName("tr");
}
function getOdd(row, index){
	return row.children[6+index].innerText;
}
function getMatch(row){
	var home = row.getElementsByClassName("home")[0].innerText;
	var away = row.getElementsByClassName("away")[1].innerText;
	if(!home || home == "" || !away || away == "") return null;
	return (home+" "+away).replace(/[ ][ ]/g," ");
}
function findResult(row){
	return row.getElementsByClassName("detail")[0].innerText;
}
function getScore(score){
  score = score.split(":");
  return [parseInt(score[0]),parseInt(score[1])];
}
function print(array){
	var out = "";
	for(record in array){
		out+=array[record]+"\n";
	}
	console.log(out);
}
function getTeamsFromResults(s){
	results = s.split("\n");
	var matches = [];
	
}
function item(match, odd1,oddX,odd2,result){
	var ceiling = 10;
	this.match = match;
	this.odd1 = odd1;
	this.odd2 = odd2;
	this.oddX = oddX;
	this.result = result;
	this.stringifyAsTrainingData = function(){
		return norm(odd1,1,ceiling) +" "+ norm(oddX,1,ceiling) +" "+ norm(odd2,1,ceiling) +" "+ fixResult();
	}
	this.stringifyAsTestData = function(){
		return norm(odd1,1,ceiling) +" "+ norm(oddX,1,ceiling) +" "+ norm(odd2,1,ceiling) + " "+match; 
	}
	function norm(value, min, max){
		return Math.min(Math.max(0,(value - min) / (max - min)),1);
	}
	function fixResult(){
		return result[0]>result[1] ? "1 0 0" : result[1] > result[0]? "0 0 1" : "0 1 0";
	}
}