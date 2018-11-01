function League (name){
	this.name = name;
	this.total = 0;
	this.won = 0;
}
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

var range = [1.7,2.15];
var fromTo = [new DateString(1,7,2017),new DateString(1,11,2018)];
var leagues = [];

var started = 0;
var finished = 0;

var donePercentage;
function DataMine(){
	donePercentage = setInterval(getDonePercentage,500);
	var currentDate = new DateString(fromTo[0].day, fromTo[0].month, fromTo[0].year);
	while(!currentDate.sameDate(fromTo[1])){
		getDataForCurrentDate(currentDate);
		currentDate = currentDate.nextDay();
	}
}
function printLeagueInfo(){
	for(l in leagues){
		if(leagues[l].total > 0)
		console.log(leagues[l].name +" : "+(100.0*leagues[l].won/leagues[l].total)+"%");
	}
}
function printThisPagesLeagueInfo(){
	var table = getTable(document);
	var rows = getRows(table);
	var currentLeague;
	for(r in rows){
		if(rows[r].className == "headupe"){
			debugger;
			currentLeague = getLeague(rows[r]);
			if(currentLeague.total > 0)
				console.log(currentLeague.name +" : "+(100.0*currentLeague.won/currentLeague.total)+"%");
		}
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
function getDataInDom(dom){
	var table = getTable(dom);
	var rows = getRows(table);
	var currentLeague;
	for(r in rows){
		if(rows[r].className == "headupe")
			currentLeague = getLeague(rows[r]);
		else if( rows[r].className == "onem" || rows[r].className == "twom")
			setLeagueScoring(currentLeague, rows[r]);	
	}
}
function getTable(dom){
	return dom.getElementsByTagName("tbody")[0];
}
function getRows(table){
	return table.getElementsByTagName("tr");
}
function getLeague(row){
	var leagueName = row.innerText.replace(/[\s]+/g," ");
	var league = leagues.find(function(a){return a.name == leagueName;});
	if(!league){
		league = new League(leagueName);
		leagues.push(league);
	}
	return league;
}
function setLeagueScoring(league, row){
	var score = row.getElementsByClassName("detail")[0].innerText.replace(/[^0-9:]/g,"").split(":");
	score[0] = parseInt(score[0]);
	score[1] = parseInt(score[1]);
	if( isNaN(score[0]) || isNaN(score[1]))
		return;
	var oddH = parseFloat(row.children[6].innerText.replace(/[\s]/g,""));
	var oddA = parseFloat(row.children[8].innerText.replace(/[\s]/g,""));
	if( isNaN(oddH) || isNaN(oddA))
		return;
	if(withinRange(oddH)){
		league.total++;
		if(score[0] > score[1]) league.won ++;
	}else if(withinRange(oddA)){
		league.total++;
		if(score[1]>score[0]) league.won ++;
	}
}
function withinRange(o){
	return o >= range[0] && o <= range[1];
}