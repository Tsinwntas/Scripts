var matches = [];
var leagues = [];

var table_definition = {
	TIPS: 0,
	UPCOMING : 1,
	STANDINGS: 2,
	HOME_STANDINGS: 3,
	AWAY_STANDINGS: 4,
	LATEST_RESULTS: 5,
	LAST_5_STANDINGS: 6,
	LAST_5_HOME: 7,
	LAST_5_AWAY: 8,
	OVER_UNDER: 9,
	BETTING_INDEX: 10
}

var HOME_IMPORTANCE = [
	"Home field has extraordinary big influence",
	"Home field is big advantage for home team",
	"Home field is advantage for home team",
	"Home field has no special importance on game result",
	"Home field is disadvantage for home team",
	"Lalalala this is nothing"
]

var DRAWS = [
	"Draw occurrence in this league is extremely high",
 	"Draws are more common in this league",
	"Number of draws is on average level",
	"Draws are less common in this league",
	"In this league draw occurance is very low"
]

var GOALS = [
	"Number of goals is extremely high",
	"Number of goals is above the average",
	"Number of goals per game is normal",
	"Number of goals is lower than typical",
	"Number of goals is very low"
]

var OVER25 = [
	"Number of games with three or more goals in these leagues is extremely high",
	"Number of games with three or more goals is above the average",
	"Number of games with three or more goals is normal",
	"Number of games with three or more goals is lower than typical",
	"Number of games with three or more goals is very low"
]

var RELIABILITY = [
	"Favourites win almost every time",
	"Favourites usually win in this league",
	"Average league for betting",
	"Bet very carefuly here",
	"League full of surprises"
]

function Match(league, home, away, link, date, round) {
	this.league = league;
	this.home = home;
	this.away = away;
	this.link = link;
	this.date = date;
	this.round = round;
}

function League(name){
	this.name = name;
	this.teams = [];
}

function Team(name, points, score){
	this.name = name;
	this.points = points;
	this.score = score;
}

function enumarateTables(league, tables){
	var unsortedTables = [...tables];
	var keys = [{k:"TIPS",v:"home field|draw|number of goals|number of games|favourites|average league|very carefuly|full of surprises"},
	{k:"UPCOMING", v:"result prediction"},
	{k:"STANDINGS", v:"points"},
	{k:"HOME_STANDINGS", v:"home", n:"over in % of games"},
	{k:"AWAY_STANDINGS", v:"away", n:"over in % of games"},
	{k:"LATEST_RESULTS", v:"home team"},
	{k:"LAST_5_STANDINGS", v:"points"},
	{k:"LAST_5_HOME", v:"home", n:"over in % of games"},
	{k:"LAST_5_AWAY", v:"away", n:"over in % of games"},
	{k:"OVER_UNDER", v:"over in % of games"},
	{k:"BETTING_INDEX", v:"betting index"}];
	var found = 0;
	league.table_definition = {};
	keys.forEach(key=>{
		var index = findInTables(unsortedTables, key.v, key.n);
		if(index != -1){
			league.table_definition[key.k] = index + found;
			unsortedTables.splice(index,1);
			found++;
		} else {
			league.table_definition[key.k] = -1;
		}
	})
}

function findInTables(tables, value, valueNot){
	return tables.findIndex(t=>t.textContent.toLowerCase().match(value) && (!valueNot || !t.textContent.toLowerCase().match(valueNot)));
}

function getInformation(league, table, index){
	try{
		switch(index){
			case league.table_definition.TIPS:
				getTips(league, table);
				break;
			case league.table_definition.UPCOMING:
				getUpcoming(league, table);
				break;
			case league.table_definition.STANDINGS:
				getStandings(league, table);
				break;
			case league.table_definition.HOME_STANDINGS:
				getHomeStandings(league, table);
				break;
			case league.table_definition.AWAY_STANDINGS:
				getAwayStandings(league, table);
				break;
			case league.table_definition.LATEST_RESULTS:
				getLatestResults(league, table);
				break;
			case league.table_definition.LAST_5_STANDINGS:
				getLast5Standings(league, table);
				break;
			case league.table_definition.LAST_5_HOME:
				getLast5Home(league, table);
				break;
			case league.table_definition.LAST_5_AWAY:
				getLast5Away(league, table);
				break;
			case league.table_definition.OVER_UNDER:
				getOverUnder(league, table);
				break;
			case league.table_definition.BETTING_INDEX:
				getBettingIndex(league, table);
				break;
			}
	}catch(e){
		console.log(league+" failed at "+index);
	}
}

function getTips(league, table){
	league.homeAdvantage = getHomeAdvantage(table);
	league.draws = getDraws(table);
	league.goals = getGoals(table);
	league.goalsPerGame = getGoalsPerGame(table);
	league.betting = getBetting(table);
}

function getHomeAdvantage(table){
	return getComparisson(table, 0, HOME_IMPORTANCE);
}

function getDraws(table){
	return getComparisson(table, 1, DRAWS);
}

function getGoals(table){
	return getComparisson(table, 2, GOALS);
}

function getGoalsPerGame(table){
	return getComparisson(table, 3, OVER25);
}

function getBetting(table){
	return getComparisson(table, 4, RELIABILITY);
}

function getComparisson(table, row, check){
	var advice = getTipsRow(table,row);
	try{
		var index = check.findIndex(c=> advice.includes(c));
	index = index == -1 ? 0 : (check.length - 3) - index;
	return isNaN(index) ? 0 : index;
	} catch(e){
		return 0;
	}
}

function getTipsRow(table,row){
	return table.getElementsByTagName("tr")[row].textContent;
}

function getUpcoming(league, table){
	getRows(table).forEach(r=>{
		if(isToday(r)){
			matches.push(new Match(league.name, getHome(r), getAway(r), getLink(r), getDate(r), getRound(r)));
		}
	});
}

function isToday(row){
	var date = getDate(row);
	var today= new Date();
	return date.getMonth() == today.getMonth() && date.getDate() == today.getDate();
}

function getDate(row){
	return new Date(getRowStat(row, 0));
}

function isValidMatch(row){
	return getRound(row) > 7;
}

function getRound(row){
	return getRowNumberStat(row,1);
}

function getHome(row){
	return getRowStat(row, 2).replace(/^\s*/,"").replace(/\s*$/,"");
}

function getAway(row){
	return getRowStat(row, 3).replace(/^\s*/,"").replace(/\s*$/,"");
}

function getLink(row){
	return "https://www.soccervista.com"+row.getAttribute("data-url");
}

function getStandings(league, table){
	getRows(table).forEach(row=>{
		league.teams.push(new Team(getTeamName(row), getTeamPoints(row), getTeamScore(row)));
	})
}

function getHomeStandings(league, table){
	getHomeAwayStandings(league, table, "homeStandings");
}

function getAwayStandings(league, table){
	getHomeAwayStandings(league, table, "awayStandings");
}

function getHomeAwayStandings(league, table, position){
	getRows(table).forEach(row=>{
		league.teams.find(t=>t.name == getTeamName(row))[position] = new Team(position, getTeamPoints(row), getTeamScore(row));
	});
}

function getScoreFromStats(stats){
	var split = stats.split(":");
	return [parseFloat(split[0]), parseFloat(split[1])];
}

function getLast5Standings(league, table){
	getHomeAwayStandings(league, table, "last5Standings");
}

function getLast5Home(league, table){
	getHomeAwayStandings(league, table, "last5Home");
}

function getLast5Away(league, table){
	getHomeAwayStandings(league, table, "last5Away");
}

function getLatestResults(league, table){
	//skip for now;
}

function getOverUnder(league, table){
	getRows(table).forEach(row=>{
		var team = league.teams.find(t=>t.name == getTeamName(row));
		team.ov15 = getRowNumberStat(row, 2);
		team.ov25 = getRowNumberStat(row, 3);
		team.ov35 = getRowNumberStat(row, 4);
		team.averageHomeGoals = getRowNumberStat(row, 5);
		team.averageAwayGoals = getRowNumberStat(row, 6);
		team.averageTotalGoals = getRowNumberStat(row, 7);
	});
}

function getBettingIndex(league, table){
	getRows(table).forEach(row=>{
		league.teams.find(t=>t.name == getTeamName(row)).bettingIndex = getRowNumberStat(row, 4);
	})
}

function getTeamName(row){
	return getRowStat(row, 1);
}

function getTeamPoints(row){
	return getRowNumberStat(row, 7);
}

function getTeamScore(row){
	return getScoreFromStats(getRowStat(row, 6));
}

function getRows(table){
	return table.querySelectorAll("tr[class~=onem], tr[class~=twom]");
}

function getRowNumberStat(row, index){
	var num = parseFloat(getRowStat(row, index));
	return isNaN(num) ? 0 : num;
}

function getRowStat(row, index){
	return row.getElementsByTagName("td")[index].textContent;
}

function getLeaguesInformation(dom){
	var tables = dom.getElementsByTagName("table");
	var league = new League(getLeague(dom));
	enumarateTables(league, tables);
	for(var i = 0; i < tables.length; i++)
		getInformation(league,tables[i],i);
	leagues.push(league);
}

function getLeague(dom){
	return dom.getElementsByTagName("h1")[1].textContent.replace(/^[^A-Z]*/,"");
}

function calculateMatchOdds(match){
	var league = getLeagueFromName(match.league);
	if(league.teams.length == 0){
		return;
	}
	var home = getHomeFromMatch(match);
	var away = getAwayFromMatch(match);
	fixMatch(match,league,home,away);
	// console.log(home);
	// console.log(away);
	match.o15 = calculateOver(league, home, away, 1.5);
	match.o25 = calculateOver(league, home,away, 2.5);
	match.o35 = calculateOver(league, home,away, 3.5);
	match.ft1 = calculateFT(league, home,away, "home");
	match.ftX = calculateFT(league, home,away, "draw");
	match.ft2 = calculateFT(league, home,away, "away");
	fixFT(match);
	// console.log(match);
}

function fixMatch(match,league,home,away){
	match.homeName = match.home;
	match.leagueName = match.league;
	match.awayName = match.away;
	match.home = home;
	match.league = league;
	match.away = away;
}

function removeMatch(match){
	matches.splice(matches.findIndex(m=>m.league == match.league && m.home == match.home && m.away == match.away), 1);
}

function getLeagueFromName(name){
	return leagues.find(l=>l.name == name);
}

function getHomeFromMatch(match){
	return getTeamFromMatch(match, "home");
}

function getAwayFromMatch(match){
	return getTeamFromMatch(match, "away");
}

function getTeamFromMatch(match, side){
	return getLeagueFromName(match.league).teams.find(t=>t.name == match[side]);
}

function calculateOver(league, home, away, over){
	var calculation = 0;
	try{
		if(league.goalsPerGame)
			calculation += 2.5 - over + league.goalsPerGame;
		if(home.averageHomeGoals && away.averageAwayGoals)
			calculation += (home.averageHomeGoals + away.averageAwayGoals)/2 - over;
		if(home.averageTotalGoals && away.averageTotalGoals)
		calculation += (home.averageTotalGoals + away.averageTotalGoals)/2 - over;
		calculation += getAdviceFromPercentage((home["ov"+(over*10)]+away["ov"+(over*10)])/2);

		calculation += getAdviceFromStandings(league, home, away, [], []);
		calculation += getAdviceFromStandings(league, home, away, ["homeStandings"], ["awayStandings"]);
		calculation += getAdviceFromStandings(league, home, away, ["last5Standings"], ["last5Standings"]);
		calculation += getAdviceFromStandings(league, home, away, ["last5Home"], ["last5Away"]);

	}catch(e){}
	return calculation;
}

/*
function getAdviceFromScores(league, home, away){
	var calculation = 0;
	var leagueScoreMax = getMaxScore(league,0);
	var leagueScoreMin = getMinScore(league,0); 
	var leagueConcMax = getMaxScore(league,1);
	var leagueConcMin = getMinScore(league,1); 

	var homeScoring = getAdviceFromScore(home.score[0], leagueScoreMin, leagueScoreMax);
	var awayScoring = getAdviceFromScore(away.score[0], leagueScoreMin, leagueScoreMax);
	var homeConceding = getAdviceFromScore(home.score[1], leagueConcMin, leagueConcMax);
	var awayConceding = getAdviceFromScore(away.score[1], leagueConcMin, leagueConcMax);
	calculation += getAdviceFromPercentage((homeScoring + awayConceding)/2);
	calculation += getAdviceFromPercentage((homeConceding + awayScoring)/2);
	return calculation;
}

function getMaxScore(league, scoreType){
	return league.teams.sort((t1,t2)=>t2.score[scoreType]-t1.score[scoreType])[0].score[scoreType];
}

function getMinScore(league, scoreType){
	return league.teams.sort((t1,t2)=>t1.score[scoreType]-t2.score[scoreType])[0].score[scoreType];
}
*/

function getAdviceFromStandings(league, home, away, standing1, standing2){
	var calculation = 0;

	var leagueScoreMaxStanding1 = getMaxStandingScore(league,standing1,0);
	var leagueScoreMinStanding1 = getMinStandingScore(league,standing1,0); 
	var leagueConcMaxStanding1 = getMaxStandingScore(league,standing1,1);
	var leagueConcMinStanding1 = getMinStandingScore(league,standing1,1); 

	var leagueScoreMaxStanding2 = getMaxStandingScore(league,standing2,0);
	var leagueScoreMinStanding2 = getMinStandingScore(league,standing2,0); 
	var leagueConcMaxStanding2 = getMaxStandingScore(league,standing2,1);
	var leagueConcMinStanding2 = getMinStandingScore(league,standing2,1); 

	var homeScoring = getNormalized(getItem(home,standing1).score[0], leagueScoreMinStanding1, leagueScoreMaxStanding1);
	var awayScoring = getNormalized(getItem(away,standing2).score[0], leagueScoreMinStanding2, leagueScoreMaxStanding2);
	var homeConceding = getNormalized(getItem(home,standing1).score[1], leagueConcMinStanding1, leagueConcMaxStanding1);
	var awayConceding = getNormalized(getItem(away,standing2).score[1], leagueConcMinStanding2, leagueConcMaxStanding2);
	calculation += getAdviceFromPercentage((homeScoring + awayConceding)/2);
	calculation += getAdviceFromPercentage((homeConceding + awayScoring)/2);
	return isNaN(calculation) ? 0 : calculation;
}

function getMaxStandingScore(league, standing, scoreType){
	return getItem(league.teams.sort((t1,t2)=>getItem(t2,standing).score[scoreType]-getItem(t1,standing).score[scoreType])[0],standing).score[scoreType];
}

function getMinStandingScore(league, standing, scoreType){
	return getItem(league.teams.sort((t1,t2)=>getItem(t1,standing).score[scoreType]-getItem(t2,standing).score[scoreType])[0],standing).score[scoreType];
}

function calculateFT(league, home, away, side){
	var calculation = 0;
	try{
		if(home.points && away.points)
			calculation += getAdviceFromPointStandings(league, home, away, side, [], []);
		if(home.homeStandings && away.awayStandings)
			calculation += getAdviceFromPointStandings(league, home, away, side, ["homeStandings"], ["awayStandings"]);
		if(home.last5Standings && away.last5Standings)
			calculation += getAdviceFromPointStandings(league, home, away, side, ["last5Standings"], ["last5Standings"]);
		if(home.last5Home && away.last5Away)
			calculation += getAdviceFromPointStandings(league, home, away, side, ["last5Home"], ["last5Home"]);
	}catch(e){console.log(e)}
	return calculation;
}

function getAdviceFromPointStandings(league, home, away, side, standing1, standing2){
	var calculation = 0;

	var leaguePointsMaxStanding1 = getMaxStandingPoints(league,standing1);
	var leaguePointsMinStanding1 = getMinStandingPoints(league,standing1);  

	var leaguePointsMaxStanding2 = getMaxStandingPoints(league,standing2);
	var leaguePointsMinStanding2 = getMinStandingPoints(league,standing2); 

	var homePoints = getNormalized(getItem(home,standing1).points, leaguePointsMinStanding1, leaguePointsMaxStanding1);
	var awayPoints = getNormalized(getItem(away,standing2).points, leaguePointsMinStanding2, leaguePointsMaxStanding2);
	var sideWon = homePoints > awayPoints ? 1 : homePoints < awayPoints ? -1 : 0; 
	calculation += getAdviceFromPercentage(Math.abs(homePoints - awayPoints), true)*sideWon;
	calculation = isNaN(calculation) ? 0 : calculation;
	switch(side){
		case "home":
			return calculation;
		case "draw":
			return 6 - Math.abs(calculation);
		case "away":
			return calculation*-1;
	}
}

function getMaxStandingPoints(league, standing){
	return getItem(league.teams.sort((t1,t2)=>getItem(t2,standing).points-getItem(t1,standing).points)[0],standing).points;
}

function getMinStandingPoints(league, standing){
	return getItem(league.teams.sort((t1,t2)=>getItem(t1,standing).points-getItem(t2,standing).points)[0],standing).points;
}

function fixFT(match){
	var bettingIndexes = [30,20,10,0,-10000];
	if(match.ft1 > match.ft2){
		if(match.home.bettingIndex)
			match.ft1 += getAdviceFromBettingIndex(match.home.bettingIndex)
		if(match.league.betting)
			match.ft1 += match.league.betting;
	}
	if(match.ft2 > match.ft1){
		if(match.away.bettingIndex)
			match.ft2 += getAdviceFromBettingIndex(match.away.bettingIndex)
		if(match.league.betting)
			match.ft2 += match.league.betting;
	}
	if(match.league.homeAdvantage){
		match.ft1 += match.league.homeAdvantage;
		match.ft2 += match.league.homeAdvantage * -1;
	}
	if(match.league.draws)
		match.ftX += match.league.draws;
}

function getAdviceFromBettingIndex(value){
	var bettingIndexes = [30,20,10,0,-10000];
	for(var i=0; i< bettingIndexes.length; i++){
		if(value >= bettingIndexes[i])
			return 2-i;
	}
	return -10000;
}

function getItem(item, depth){
	var output = item;
	depth.forEach(d=>output=output[depth]);
	return output;
}

function getNormalized(value, min, max){
	return ((value-min) / (max-min))*100;
}

function getAdviceFromPercentage(perc, onlyPositives){
	var toAdd = !onlyPositives ? 0 : 3
	if(perc <= 20)
		return -2+toAdd;
	if(perc <= 40)
		return -1+toAdd;
	if(perc <= 60)
		return 0+toAdd;
	if(perc <= 80)
		return 1+toAdd;
	return 2+toAdd;
}

function getTodaysLeagues(){
	return Array.from(document.getElementsByClassName("list_today")[0].getElementsByTagName("a")).map(l=>l.href);
}

function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}
function getDataForLeague(league){
	started++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getLeaguesInformation(turnToDom(xmlHttp.responseText));
			finished++;
        }
    }
    xmlHttp.onerror = function(){
    	console.log("Failed to get Data for "+league);
    	finished++;
    }
    xmlHttp.open("GET", league, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getDonePercentage(checkingResults){
	if(started>0){
		var range = linksToGet.length;
		if(finished < range){
			console.log((100.0*finished/range)+"%");
		}else{
			console.log("Done.");
			clearInterval(donePercentage);
			if(!checkingResults){
				fixData();
			}
			printMatches(matches, checkingResults);
		}
	}
}

function getData(){
	donePercentage = setInterval(getDonePercentage,100);
	linksToGet.forEach(l=>getDataForLeague(l));
}

function fixData(){
	matches.forEach(m=>calculateMatchOdds(m))
	matches = matches.filter(m=>m.homeName)
}

function printMatches(matches, checkingResults){
	matches.forEach(m=>{
		console.log("**************************************************")
		if(!m.results && !checkingResults){
			console.log(m.leagueName);
			console.log(m.homeName + " vs " + m.awayName)
			console.log("1:"+m.ft1+" | X:"+m.ftX+" | 2:"+m.ft2);
			console.log("o1.5:"+m.o15+" | o2.5:"+m.o25+" | o3.5:"+m.o35);
		} else if(m.results) {
			console.log(m.leagueName);
			console.log(m.homeName + " " + m.results.score[0] + ":" + m.results.score[1] + " " + m.awayName)
			console.log("1:"+m.results.ft1+"("+m.ft1+") | X:"+m.results.ftX+"("+m.ftX+") | 2:"+m.results.ft2+"("+m.ft2+")");
			console.log("o1.5:"+m.results.o15+"("+m.o15+") | o2.5:"+m.results.o25+"("+m.o25+") | o3.5:"+m.results.o35+"("+m.o35+")");
		}
	});
}

function printValidPredictions(matches){
	matches.forEach(m=>{
		console.log("**************************************************")
		// if(!m.results){
			console.log(m.leagueName);
			console.log(m.homeName + getResult(m) + m.awayName)
			var ft = "";
			if(isValidFTPrediction(m.ft1))
				ft += m.ft1 > 0 ? "1" : "2";
			if(isValidFTPrediction(m.ftX) && m.ftX > 0)
				ft += ft.length>0 ? "X" : "";
			console.log("FT: "+ft+checkResultsFt(m,ft));

			var ou = "";
			if(isValidOverPrediction(m.o35) && m.o35 > 0)
				ou += "Over 3.5";
			else if(isValidOverPrediction(m.o25) && m.o25 > 0)
				ou += "Over 2.5";
			else if(isValidOverPrediction(m.o15) && m.o15 > 0)
				ou += "Over 1.5";
			else if(isValidOverPrediction(m.o15) && m.o15 < 0)
				ou += "Under 1.5";
			else if(isValidOverPrediction(m.o25) && m.o25 < 0)
				ou += "Under 2.5";
			else if(isValidOverPrediction(m.o35) && m.o35 < 0)
				ou += "Under 3.5";
			console.log(ou == "" ? "Over/Under: -" : ou + checkResultsOver(m,ou));
		// } else {
		// 	console.log(m.leagueName);
		// 	console.log(m.homeName + " " + m.results.score[0] + ":" + m.results.score[1] + " " + m.awayName)
		// 	console.log("1:"+m.results.ft1+"("+m.ft1+") | X:"+m.results.ftX+"("+m.ftX+") | 2:"+m.results.ft2+"("+m.ft2+")");
		// 	console.log("o1.5:"+m.results.o15+"("+m.o15+") | o2.5:"+m.results.o25+"("+m.o25+") | o3.5:"+m.results.o35+"("+m.o35+")");
		// }
	});
}

function getResult(match){
	return match.results ? " " + match.results.score[0] + ":" + match.results.score[1] + " " : " vs ";
}

function checkResultsFt(match, ft){
	if(!match.results)
		return "";
	if(ft == "")
		return "-";
	var result = "-";
	Array.from(ft).forEach(p=>{
		if(result!="W" && match.results["ft"+p] == "L")
			result = "L";
		else if(match.results["ft"+p] == "W")
			result = "W";
	})
	return " "+result;
}

function checkResultsOver(match, ou){
	if(!match.results)
		return "";
	if(ou == "")
		return "";
	return " "+match.results["o"+getOverNumber(ou)];
}

function getOverNumber(ou){
	return parseInt(parseFloat(ou.split(" ")[1])*10);
}

started = 0;
finished = 0;
donePercentage = "interval";
linksToGet = getTodaysLeagues();
getData();


function checkResults(json){
	started = 0;
	finished = 0;
	if(json){
		linksToGet = JSON.parse(json);
		matches = linksToGet;
	}
	donePercentage = setInterval(getDonePercentage,100, true);
	matches.forEach(m=>getDataForMatch(m));		
}


function getDataForMatch(match){
	started++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            checkResultsForMatch(turnToDom(xmlHttp.responseText),match);
			finished++;
        }
    }
    xmlHttp.onerror = function(){
    	console.log("Failed to get Data for "+match.homeName + " vs " + match.awayName);
    	finished++;
    }
    xmlHttp.open("GET", match.link, true); // true for asynchronous 
    xmlHttp.send(null);
}

function checkResultsForMatch(dom, match){
	var score = getScore(dom);
	if(isNaN(score[0]) || isNaN(score[1]))
		return;

	match.results = {};
	match.results.score = score;
	
	match.results.ft1 =  isValidFTPrediction(match.ft1) ? ((score[0]-score[1])*match.ft1 > 0 ? 'W' : 'L') : '-';
	match.results.ftX =  isValidFTPrediction(match.ftX) ? ((score[0] == score[1] && match.ftX > 0) || (score[0]!=score[1]&&match.ftX<0) ? 'W' : 'L') : '-';
	match.results.ft2 =  isValidFTPrediction(match.ft2) !=0 ? ((score[1]-score[0])*match.ft2 > 0 ? 'W' : 'L') : '-';

	match.results.o15 = isValidOverPrediction(match.o15) ? ((score[0]+score[1]-1.5)*match.o15 > 0 ? 'W' : 'L') : '-';
	match.results.o25 = isValidOverPrediction(match.o25) ? ((score[0]+score[1]-2.5)*match.o25 > 0 ? 'W' : 'L') : '-';
	match.results.o35 = isValidOverPrediction(match.o35) ? ((score[0]+score[1]-3.5)*match.o35 > 0 ? 'W' : 'L') : '-';
}

function getScore(dom){
	var split = dom.getElementsByClassName("score")[0].innerText.split(":");
	return [parseInt(split[0]), parseInt(split[1])];	
}

function isValidFTPrediction(value){
	return isValidPrediction(value, 12);
}

function isValidOverPrediction(value){
	return isValidPrediction(value, 6);
}

function isValidPrediction(value, range){
	return value > range || value < -1*range;
}