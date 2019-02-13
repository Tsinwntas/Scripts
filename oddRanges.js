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
var done = false;
function DataMine(){
	started = 0;
	finished = 0;
	done = false;
	donePercentage = setInterval(getDonePercentage,500);
	var currentDate = new DateString(fromTo[0].day, fromTo[0].month, fromTo[0].year);
	while(!currentDate.sameDate(fromTo[1])){
		console.log(currentDate.stringForm);
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
			done = true;
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
function Odd(value){
	this.value = value;
	this.won = 0;
	this.total = 0;
}
function Mapping(){
	this.odds = [];
	this.averageProfit;
	this.averageSuccess;
	this.fixMap = function(){
		var profit = 0;
		var won = 0;
		var total = 0;
		for(var i =0; i < this.odds.length; i++){
			profit+=this.odds[i].won*this.odds[i].value;
			won+= this.odds[i].won;
			total+=this.odds[i].total;
		}
		this.averageProfit = profit*1.0 / total;
		this.averageSuccess = won*1.0/ total;
	}
}
oddMap = [];
fixedMap = [];
function getDataInDom(dom){
	var onem = dom.getElementsByClassName("onem");
	var twom = dom.getElementsByClassName("twom");
	getDataInRow(onem);
	getDataInRow(twom);

}
function getDataInRow(row){
	for(var i =0; i <row.length; i++){
		try{
			var score = parseScore(row[i].getElementsByTagName("a")[0].innerText);
			var odd = parseFloat(row[i].children[6].innerText);
			if(isNaN(score[0])||isNaN(score[1])||isNaN(odd))continue;
			var currOdd = oddMap.find(function(a){return a.value == odd;});
			if(!currOdd){
				currOdd = new Odd(odd);
				oddMap.push(currOdd);
			}
			if(score[0] > score[1])
				currOdd.won ++;
			currOdd.total++;
		}catch(DOMException){
			console.log(DOMException)
		}
	}
}
function parseScore(value){
	var splitted = value.split(":");
	return [parseFloat(splitted[0]),parseFloat(splitted[1])];
}
var mining;
function start(){
	DataMine();
	mining = setInterval(checkForDone,500);
}
function checkForDone(){
	if(done){
		clearInterval(mining);
		console.log("Fixing Data..");
		sortData();
		createMap();
		presentData();
	}
}
function sortData(){
	oddMap = oddMap.sort(function(a,b){
		return a.value - b.value;
	});
}
function createMap(){
	for(var i =0; i < oddMap.length; i++){
		for(var j =0; j < oddMap.length; j++){
			var map = new Mapping();
			for(var k = 0; k <= j; k++){
				map.odds.push(oddMap[k]);
			}
			map.fixMap();
			fixedMap.push(map);
		}
	}
}
function presentData(){
	console.log(fixedMap);
}