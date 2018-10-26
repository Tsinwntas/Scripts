var league = "Premier League";
var teams = [];
var matches = [];

var started = 0;
var finished = 0;

var interv;

var FT = "";
var GG = "";
var O25 = "";
var CSv1 = "";
var CSv2 = "";

function Match(s){
	var data = s.split(",");
	this.date = data[0];
	this.home = data[1];
	this.away = data[2];
	var scoring = data[3].split(":");
	this.score = [parseInt(scoring[0]),parseInt(scoring[1])];
}
function Team(t,l){
	this.name = t;
	this.id = 0;
	this.link = l
}

function DataMine(){
	fillTeams();
	normaliseTeams();
	getDataForAllTeams();
	interv = setInterval(checkState,1000);
}
function fillTeams(){
	var table = document.getElementsByTagName("tbody")[2];
	for(i in table.children){
		if(table.children[i].className == "onem" || table.children[i].className == "twom"){
			teams.push(new Team(getTeam(table.children[i].innerText),table.children[i].getElementsByTagName("a")[0].href));
		}
	}
}
function getTeam(s){
	return s.replace(/[^A-Z]+/,"").replace(/[^A-Za-z]+$/,"");
}
function normaliseTeams(){
	teams = teams.sort(function(a,b){return a.name.localeCompare(b.name);});
	for(var i=0; i < teams.length; i++){
		teams[i].id = normalise(i, 0, teams.length);
	}
}
function normalise(value, min, max){
  return (1.0 * (value - min) / (max - min)) * 2 - 1
}
function getDataForAllTeams(){
	for(i in teams){
		getDataForTeam(teams[i]);
	}
}
function getDataForTeam(t){
	started ++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getHistoryForLeagueInLink(turnToDom(xmlHttp.responseText));
            finished++;
        }
    }
    xmlHttp.open("GET", t.link, true); // true for asynchronous 
    xmlHttp.send(null);
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}
function getHistoryForLeagueInLink(dom){
	var p = dom.getElementsByTagName("tbody")[1];
	var flag = false;
	for(var i = 0; i < p.children.length; i++){
		if(flag && (p.children[i].className=="twom" || p.children[i].className=="onem")){
			var date = p.children[i].innerText.replace(/[A-Z].+$/,"").replace(/[ ]/g,"");
			var match = p.children[i].innerText.replace(/[^A-Z]+/,"").replace(/[\s]+/g," ").replace(/[ ]$/,"");
			var teams = match.split(/[0-9]+[:][0-9]+/);
			var score = match.replace(/[^(0-9+:0-9+)]/g,"");
			var matchString = new Match(date+","+teams[0]+","+teams[1]+","+score);
			//console.log(matchString);
			if(!matches.find(function(a){
				for(prop in a){
					if(prop != "score" && a[prop] != matchString[prop])
						return false;
				}
				return true;
			}))
			matches.push(matchString);
		}
		else{
			var l = p.children[i].getElementsByTagName("a");
			if(l && l[0].innerText.includes(league)) flag = true;
			else flag = false;
	    }
	}
}

function checkState(){
	if(finished == teams.length){		
		clearInterval(interv);
		console.log("Started: "+started+" - Finished: "+finished+" - Teams: "+teams.length);
		sortMatches();
		fitHistoryToNNData();
		return;
	}else{
		console.log("Started: "+started+" - Finished: "+finished+" - Teams: "+teams.length);
	}

}
function sortMatches(){
	matches = matches.sort(function(a,b){
		var dateA = a.date.split(".");
		var dateB = b.date.split(".");
		return 1000*parseInt(dateA[2]) + 100*parseInt(dateA[1]) + parseInt(dateA[0]) - (1000*parseInt(dateB[2]) + 100*parseInt(dateB[1]) + parseInt(dateB[0]));
	});
}
function fitHistoryToNNData(){
	for(m in matches){
		if(m > 0){
			FT+="\n";
			GG+="\n";
			O25+="\n";
			CSv1+="\n";
			CSv2+="\n";
		}
		fitToFT(matches[m]);
		fitToGG(matches[m]);
		fitToO25(matches[m]);
		fitToCSv1(matches[m]);
		fitToCSv2(matches[m]);
	}
}
function fitToFT(m){
	FT+=getTeamId(m.home)+" "+getTeamId(m.away)+" ";
	if(m.score[0] > m.score[1])
		FT+="1 0 0";
	else if(m.score[0] == m.score[1])
		FT+="0 1 0";
	else if(m.score[0] < m.score[1])
		FT+="0 0 1";
}
function fitToGG(m){
	GG+=getTeamId(m.home)+" "+getTeamId(m.away)+" "+semiNormalise(Math.min(10,m.score[0]),0,10)+" "+semiNormalise(Math.min(10,m.score[1]),0,10);
}
function fitToO25(m){
	O25+=getTeamId(m.home)+" "+getTeamId(m.away)+" "+semiNormalise(Math.min(20,m.score[0]+m.score[1]),0,20);
}
function fitToCSv1(m){
	CSv1+=getTeamId(m.home)+" "+getTeamId(m.away)+" ";
	for(var i = 0; i < 20+2; i++){
		if(i > 0)
			CSv1+=" ";
		if(i == m.score[0] || i == 10+1+m.score[1])
			CSv1+="1";
		else
			CSv1+="0";
	}
}
function fitToCSv2(m){
	CSv2+=getTeamId(m.home)+" "+getTeamId(m.away)+" "+semiNormalise(Math.min(10,m.score[0]),0,10)+" "+semiNormalise(Math.min(10,m.score[1]),0,10);
}
function semiNormalise(value, min, max){
	return (1.0 * (value - min) / (max - min));
}


function getTeamId(t){
	var team =teams.find(function(a){ return a.name == t });
	if(team) 
		return team.id;
	else return 1;
}