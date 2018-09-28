var totalMatchesToCheck = 0;
var stepsDone = 0;
var matches = [];
var interval = setInterval(countDonePercentage,500);
var percentages = [];
getAllPercentages();

function countDonePercentage(){
	if(totalMatchesToCheck == 0){
		console.log("0%");
	}else if(stepsDone == totalMatchesToCheck*3){
		console.log("100%");
		clearInterval(interval);
	}else{
		console.log((100.0*stepsDone / (3*totalMatchesToCheck))+"%");
	}
}

function getAllPercentages(){
	var table = getTable();
	matches = getMatchesFromTable(table);
	for(match in matches)
		getTrustFromMatch(matches[match]);
}
function getTable(){

	return document.getElementsByClassName("main")[0];
}
function getMatchesFromTable(table){
	var matches = [];
	var rows = getRowsFromTable(table);
	totalMatchesToCheck = rows.length;
	for(row in rows)
		matches.push(getMatchFromRow(rows[row]));
	return matches;
}
function getRowsFromTable(table){
	var tRows = table.getElementsByTagName("tr");
	var rows = [];
	for(row in tRows){
		if(tRows[row].className == "onem" || tRows[row].className == "twom")
			rows.push(tRows[row]);
	}
	return rows;
}
function getMatchFromRow(row){
	var home = getHomeFromRow(row);
	var away = getAwayFromRow(row);
	var link = getLinkFromRow(row);
	return new Match(home,away,link);
}
function getHomeFromRow(row){

	return row.getElementsByClassName("home")[0].innerHTML.replace(/[&]nbsp[;]/g,"");
}
function getAwayFromRow(row){

	return row.getElementsByClassName("away")[1].innerHTML.replace(/[&]nbsp[;]/g,"");
}
function getLinkFromRow(row){

	return row.getElementsByClassName("detail")[0].getElementsByTagName("a")[0].href;
}
function getTrustFromMatch(match){

	httpGetAsync(match,getTeamPercentageFromMatchPage);
}
function getTeamPercentageFromMatchPage(dom,match){
	var homeLink = getHomeLink(dom);
	var awayLink = getAwayLink(dom);
	httpGetAsync(new Team(match.home,homeLink),getTeamPercentage);
	httpGetAsync(new Team(match.away,awayLink),getTeamPercentage);
}
function getHomeLink(dom){

	return dom.getElementsByTagName("h1")[1].getElementsByTagName("a")[0].href;
}
function getAwayLink(dom){

	return dom.getElementsByTagName("h1")[2].getElementsByTagName("a")[0].href;
}
function getTeamPercentage(dom,team){
	var prevMatches = getPrevMatches(dom);
	team.trust = calculateTrustFromMatches(team.name,prevMatches);
	percentages.push(team);
}
function getPrevMatches(dom){
	var prevMatches = [];
	var table = dom.getElementsByTagName("table")[1];
	var rows = getRowsFromTable(table);
	for(row in rows)
		prevMatches.push(rows[row].children[1].innerHTML.replace(/[<]b[>]/g,"").replace(/[<][/]b[>]/g,"")+","+rows[row].children[2].innerHTML+","+rows[row].children[3].innerHTML.replace(/[<]b[>]/g,"").replace(/[<][/]b[>]/g,""));
	return prevMatches;
}
function calculateTrustFromMatches(team,matches){
	var total = 0;
	var wins = 0;
	for(match in matches){
		total++;
		if(isWin(team,matches[match]))
			wins++;
	}
	return 1.0*wins/total;
}
function isWin(team,match){
	var toCheck = match.split(",");
	var score = toCheck[1].split(":");
	return (toCheck[0] == team && parseInt(score[0]) > parseInt(score[1]))
	|| (toCheck[2] == team && parseInt(score[1]) > parseInt(score[0])); 
}


function Match(home,away,link){
	this.home = home;
	this.away = away;
	this.link = link;
}
function Team(team,link){
	this.name = team;
	this.link = link;
	this.trust = 0;
}
function httpGetAsync(obj, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        	stepsDone++;
            callback(turnToDom(xmlHttp.responseText),obj);
        }
    }
    xmlHttp.open("GET", obj.link, true); // true for asynchronous 
    xmlHttp.send(null);
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}