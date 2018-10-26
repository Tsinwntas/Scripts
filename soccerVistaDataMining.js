var league = "Premier League";
var teams = [];
var matches = [];

var FT = "";
var GG = "";
var 

function Match(s){
	var data = s.split(",");
	this.date = s[0];
	this.home = s[1];
	this.away = s[2];
	var scoring = s[3].split(":");
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
}
function fillTeams(){

}
function normaliseTeams(){
	teams = teams.sort(function(a,b){return a-b;});
	for(var i=0; i < teams.length; i++){
		teams[i].id = normalise(i, 0, teams.length-1);
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
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(turnToDom(xmlHttp.responseText),t);
        }
    }
    xmlHttp.open("GET", obj.link, true); // true for asynchronous 
    xmlHttp.send(null);
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}
function getHistoryForLeagueInLink(dom){
	var flag = false;
	for(var i = 0; i < p.children.length; i++){
		if(flag && (p.children[i].className=="twom" || p.children[i].className=="onem")){
			var date = p.children[i].innerText.replace(/[A-Z].+$/,"").replace(/[ ]/g,"");
			var match = p.children[i].innerText.replace(/[^A-Z]+/,"").replace(/[\s]+/g," ").replace(/[ ]$/,"");
			var teams = match.split(/[ ]+[0-9]+[:][0-9]+[ ]+/);
			var score = match.replace(/[^(0-9+:0-9+)]/g,"");
			console.log(teams[0]+","+teams[1]+","+score);
			var matchString = new Match(date+","+teams[0]+","+teams[1]+","+score);
			matches.push(matchString);
			fitStringToNNData(matchString);
		}
		else{
			var l = p.children[i].getElementsByTagName("a");
			if(l && l[0].innerText.includes(league)) flag = true;
			else flag = false;
	    }
	}
}