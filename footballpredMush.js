websites = [];
predictions = [];
started = 0;
finished = 0;
function run(){
	started = 0;
	finished = 0;
	websites = [];
	initWebsites();
	websites.forEach(w=>getDataFromWebsite(w));
}
function mush(){
	websites.forEach(website=>{
		website.predictions.forEach(prediction=>{
			let curr = predictions.find(p=>(p.home==prediction.home || p.away == prediction.away) && p.prediction == prediction.prediction)
			if(curr){
				curr.count ++;
				curr.websites.push(website.link)
			}else{
				prediction.websites.push(website.link)
				predictions.push(prediction)
			}
		})
	})
	predictions.sort((a,b)=>b.count - a.count)
}
function print(min){
	if(predictions.length == 0){
		console.log("Nothing to print, run mush() first.");
		return [];
	}
	let printed = [];
	let output = "";
	predictions.forEach(p=>{
		if(p.count > min){
			output += p.check + " " + p.prediction + " - count: " + p.count +"\n";
			printed.push(p);
		}
	})
	console.log(output);
	return printed;
}
function findAllWithCondition(array,cond){
	array.forEach(p=>{
		if(cond(p)){
			console.log(p)
		}
	})
}
function initWebsites(){
	let init = [initSoccerPlatform,initSurePredicts,initWizPredict,initMainBet,
	initConfirmBets,initSoloPredict,initSoccerVista,initForeBet,initForeBetOU,
	initBetEnsured,initSupaTips,initBettingClosed,initStatArea,initPredictZ,
	initFullTimePredict,initTips180,initR2Bet,initBetsLoaded,initAllNigeriaFootball,
	initSportyTrader];
	init.forEach((initFunction)=>{
		let website = new Website();
		initFunction(website);
		websites.push(website);
	})
}
function mine(dom,website){
	let rows = website.getRows(dom);
	rows.forEach((row,index) => {
		if(website.startFromZero || index > 0){
			let curr = new Match();
			let teams = website.getTeams(row);
			curr.home = teams[0];
			curr.away = teams[1];
			curr.prediction = mapPrediction(website.getPrediction(row).toLowerCase()).toUpperCase();
			curr.check =  capitalise(curr.home,website.link,"home") + " v " + capitalise(curr.away,website.link,"away");
			if(!matchExists(website.predictions,curr)){
				website.predictions.push(curr);
			}
			// checkForDoubleChance(website.predictions,curr);
		}
	})
}
function matchExists(pred,match){
	return pred.find(p=>(p.home==match.home || p.away == match.away) 
		&& p.match == match.match) != null;
}
function checkForDoubleChance(pred, match){
	if(match.prediction == "1" || match.prediction == "2"){
		let dcMatch = {...match}
		dcMatch.prediction = match.prediction == "1" ? "1X" : "X2";
		debugger;
		if(!matchExists(pred,dcMatch)){
			predictions.push(dcMatch);
		} 
	}
}
function mapPrediction(prediction){
	if(prediction.includes("tip")){
		prediction = prediction.replace(/tip/,"");
	}
	if(prediction.match(/ov[0-9]/)){
		prediction = prediction.replace(/ov/,"over")
	}
	if(prediction.match(/un[0-9]/)){
		prediction = prediction.replace(/un/,"under")
	}
	if(prediction.match(/over[0-9]/)){
		prediction = prediction.replace(/over/,"over ")
	}
	if(prediction.match(/under[0-9]/)){
		prediction = prediction.replace(/under/,"under ")
	}
	if(prediction.includes("btts / gg")){
		prediction = prediction.replace(/btts [/] /,"");
	}
	if(prediction.includes("btts")){
		prediction = prediction.replace(/btts/,"gg")
	}
	if(prediction.includes("bts")){
		prediction = prediction.replace(/bts/,"gg")
	}
	switch(true){
		//case prediction.includes("x"): return prediction.toUpperCase();
		case prediction.includes("W"): return prediction.replace(/[W]/g,"");
		case prediction.match(/[^ ][&][^ ]/): return prediction.replace(/[&]/g," & ");
		default: return prediction;
	}
}

// https://soccerplatform.me/
function initSoccerPlatform(website){
	website.link = getTodaySoccerPlatform();
	website.getRows = getRowsSoccerPlatform;
	website.getTeams = getTeamsSoccerPlatform;
	website.getPrediction = getPredictionSoccerPlatform;
}
function getTodaySoccerPlatform(){
	let d = new Date();
	let date = d.getDate();
	let month = d.toDateString().split(" ")[1].toLowerCase();
	let year = d.getFullYear();
	return `https://soccerplatform.me/soccer-predictions-for-${date}-${month}-${year}/`
}
function getRowsSoccerPlatform(dom){
	return dom.getElementsByTagName("tbody")[0].querySelectorAll("tr");
}
function getTeamsSoccerPlatform(row){
	return row.children[2].innerText.toLowerCase().split(" vs ");
}
function getPredictionSoccerPlatform(row){
	return row.children[row.children.length-1].innerText;
}

//https://www.surepredicts.com/
function initSurePredicts(website){
	website.link = getTodaySurePredicts();
	website.getRows = getRowsSurePredicts;
	website.getTeams = getTeamsSurePredicts;
	website.getPrediction = getPredictionSurePredicts;
}
function getTodaySurePredicts(){
	let d = new Date();
	let date = d.getDate();
	let month = d.getMonth()+1;
	let m = month > 9 ? month : "0"+month;
	let year = d.getFullYear();
	if(d.getDay()%6  != 0)
		return `https://www.surepredicts.com/${year}/${m}/free-football-predictions-${date}-${m}-${year}.html`
	else
		return `https://www.surepredicts.com/${year}/${m}/weekend-free-football-predictions.html`
}
function getRowsSurePredicts(dom){
	return dom.getElementsByTagName("table")[0].children[0].querySelectorAll("tr");
}
function getTeamsSurePredicts(row){
	return row.children[1].innerText.replace(/[\s]*$/,"").replace(/^[\s]*/,"").toLowerCase().split(" vs ");
}
function getPredictionSurePredicts(row){
	return row.children[2].innerText;
}

//http://www.wizpredict.com/
function initWizPredict(website){
	website.link = `https://www.wizpredict.com/`;
	website.getRows = getRowsWizPredict;
	website.getTeams = getTeamsWizPredict;
	website.getPrediction = getPredictionWizPredict;
}
function getRowsWizPredict(dom){
	return dom.getElementsByTagName("tbody")[0].querySelectorAll("tr");
}
function getTeamsWizPredict(row){
	return [row.children[2].innerText.toLowerCase(),row.children[3].innerText.toLowerCase()]
}
function getPredictionWizPredict(row){
	return row.children[4].innerText;
}


//https://main-bet.com/betting-tips/
function initMainBet(website){
	website.link = `https://main-bet.com/betting-tips/`;
	website.getRows = getRowsMainBet;
	website.getTeams = getTeamsMainBet;
	website.getPrediction = getPredictionMainBet;
	website.startFromZero = true;
}
function getRowsMainBet(dom){
	return dom.querySelectorAll("table[class='bettips']");
}
function getTeamsMainBet(row){
	let teams = row.getElementsByClassName("game_match")[1].innerText.toLowerCase().split(" v ");
	return [teams[0], teams[1].split("\n")[0]];
}
function getPredictionMainBet(row){
	let score = row.getElementsByClassName("oyes")[0].innerText.replace(/^[ ]+/,"").split("-");
	let home = parseInt(score[0]);
	let away = parseInt(score[1]);
	return (home > away ? "1":"") + (Math.abs(home - away) <= 1 ? "X" : "") + (away > home ? "2" : "");
}


//https://confirmbets.com/Free-Football-Predictions
function initConfirmBets(website){
	website.link = `https://confirmbets.com/Free-Football-Predictions`;
	website.getRows = getRowsConfirmBets;
	website.getTeams = getTeamsConfirmBets;
	website.getPrediction = getPredictionConfirmBets;
}
function getRowsConfirmBets(dom){
	return dom.getElementById("PredictionDetails").querySelectorAll("tr");
}
function getTeamsConfirmBets(row){
	return row.children[3].innerText.toLowerCase().split(" vs ");
}
function getPredictionConfirmBets(row){
	return row.children[4].innerText.replace(/^[ ]+/,"");
}


//https://www.solopredict.com/
function initSoloPredict(website){
	website.link = `https://www.solopredict.com/`;
	website.getRows = getRowsSoloPredict;
	website.getTeams = getTeamsSoloPredict;
	website.getPrediction = getPredictionSoloPredict;
}
function getRowsSoloPredict(dom){
	return dom.getElementsByTagName("table")[0].querySelectorAll("tr");
}
function getTeamsSoloPredict(row){
	return [row.children[2].innerText.toLowerCase(),row.children[3].innerText.toLowerCase()];
}
function getPredictionSoloPredict(row){
	return row.children[4].innerText;
}


//https://www.soccervista.com/
function initSoccerVista(website){
	website.link = `https://www.soccervista.com/`;
	website.getRows = getRowsSoccerVista;
	website.getTeams = getTeamsSoccerVista;
	website.getPrediction = getPredictionSoccerVista;
}
function getRowsSoccerVista(dom){
	return dom.querySelectorAll("tr[class='onem'],tr[class='twom']");
}
function getTeamsSoccerVista(row){
	return [row.getElementsByClassName("home")[0].innerText.replace(/^[\s]+/,"").toLowerCase(),
	row.getElementsByClassName("away")[1].innerText.replace(/[\s]+$/,"").toLowerCase()];
}
function getPredictionSoccerVista(row){
	return row.querySelectorAll("td[align='center']")[0].innerText;
}


//https://www.forebet.com
function initForeBet(website){
	website.link = `https://www.forebet.com/en/football-predictions`;
	website.getRows = getRowsForeBet;
	website.getTeams = getTeamsForeBet;
	website.getPrediction = getPredictionForeBet;
}
function getRowsForeBet(dom){
	return dom.getElementsByClassName("schema")[0].querySelectorAll("tr[class='tr_0'],tr[class='tr_1']");;
}
function getTeamsForeBet(row){
	return [row.getElementsByClassName("homeTeam")[0].innerText.toLowerCase(),
	row.getElementsByClassName("awayTeam")[0].innerText.toLowerCase()];
}
function getPredictionForeBet(row){
	return row.getElementsByClassName("forepr")[0].innerText;
}


//https://www.forebet.com OU
function initForeBetOU(website){
	website.link = `https://www.forebet.com/en/football-predictions/under-over-25-goals`;
	website.getRows = getRowsForeBet;
	website.getTeams = getTeamsForeBet;
	website.getPrediction = getPredictionForeBetOU;
}
function getRowsForeBet(dom){
	return dom.getElementsByClassName("schema")[0].querySelectorAll("tr[class='tr_0'],tr[class='tr_1']");;
}
function getTeamsForeBet(row){
	return [row.getElementsByClassName("homeTeam")[0].innerText.toLowerCase(),
	row.getElementsByClassName("awayTeam")[0].innerText.toLowerCase()];
}
function getPredictionForeBetOU(row){
	return row.getElementsByClassName("forepr")[0].innerText + " 2.5";
}


//https://www.betensured.com/home
function initBetEnsured(website){
	website.link = `https://www.betensured.com/home`;
	website.getRows = getRowsBetEnsured;
	website.getTeams = getTeamsBetEnsured;
	website.getPrediction = getPredictionBetEnsured;
	website.startFromZero = true;
}
function getRowsBetEnsured(dom){
	return dom.getElementsByClassName("section-body-table")[1].querySelectorAll("tr");
}
function getTeamsBetEnsured(row){
	return row.children[1].innerText.toLowerCase().split(" vs ");
}
function getPredictionBetEnsured(row){
	return row.children[2].innerText;
}


//https://www.supatips.com/
function initSupaTips(website){
	website.link = `https://www.supatips.com/`;
	website.getRows = getRowsSupaTips;
	website.getTeams = getTeamsSupaTips;
	website.getPrediction = getPredictionSupaTips;
	website.startFromZero = true;
}
function getRowsSupaTips(dom){
	let cards = dom.querySelectorAll("div[class='card-body']")
	let upper = cards[0].getElementsByTagName("table")[1].querySelectorAll("tr")
	let bottom;
	for(card in cards){
		if(card > 0 && cards[card].getElementsByClassName("table").length > 0){
			bottom = cards[card].getElementsByTagName("table")[0].querySelectorAll("tr")
			break;
		}
	}
	let gathered = [];
	for(var i = 1 ; i < upper.length; i++)
		gathered.push(upper[i]);
	for(var i = 1 ; i < bottom.length; i++)
		gathered.push(bottom[i]);
	return gathered;
}
function getTeamsSupaTips(row){
	return row.children[row.childElementCount-2].innerText.toLowerCase().split(" vs ");
}
function getPredictionSupaTips(row){
	return row.children[row.childElementCount-1].innerText;
}


//https://www.bettingclosed.com/
function initBettingClosed(website){
	website.link = `https://www.bettingclosed.com/`;
	website.getRows = getRowsBettingClosed;
	website.getTeams = getTeamsBettingClosed;
	website.getPrediction = getPredictionBettingClosed;
	website.startFromZero = true;
}
function getRowsBettingClosed(dom){
	return dom.getElementsByTagName("tbody")[0].querySelectorAll("tr");
}
function getTeamsBettingClosed(row){
	return row.getElementsByClassName("classTeams")[0].innerText.toLowerCase().split(" - ");
}
function getPredictionBettingClosed(row){
	return row.children[1].innerText.split(" ")[0].toUpperCase();
}


//https://www.statarea.com
function initStatArea(website){
	website.link = `https://www.statarea.com/predictions`;
	website.getRows = getRowsStatArea;
	website.getTeams = getTeamsStatArea;
	website.getPrediction = getPredictionStatArea;
	website.startFromZero = true;
}
function getRowsStatArea(dom){
	return dom.getElementsByClassName("predictions")[1].querySelectorAll("div[class='match']");
}
function getTeamsStatArea(row){
	return [row.getElementsByClassName("name")[0].innerText.toLowerCase(),row.getElementsByClassName("name")[1].innerText.toLowerCase()];
}
function getPredictionStatArea(row){
	return row.getElementsByClassName("tip")[0].innerText;
}


//https://www.predictz.com/predictions/
function initPredictZ(website){
	website.link = `https://www.predictz.com/predictions/`;
	website.getRows = getRowsPredictZ;
	website.getTeams = getTeamsPredictZ;
	website.getPrediction = getPredictionPredictZ;
	website.startFromZero = true;
}
function getRowsPredictZ(dom){
	return dom.querySelectorAll("div[class='pttr ptcnt']");
}
function getTeamsPredictZ(row){
	return row.getElementsByClassName("ptgame")[0].innerText.toLowerCase().split(" v ");
}
function getPredictionPredictZ(row){
	let pred = row.getElementsByClassName("ptprd")[0].children[0].innerText.toLowerCase().split(" ");
	let score = pred[1].split("-");
	switch(pred[0]){
		case "home" : return "1"+(parseInt(score[0])>parseInt(score[1])+1 ? "" : "X");
		case "draw" : return "X";
		case "away" : return (parseInt(score[1])>parseInt(score[0])+1 ? "" : "X")+"2";
	}
	return "";
}


//https://fulltime-predict.com
function initFullTimePredict(website){
	website.link = `https://fulltime-predict.com/Today.html`;
	website.getRows = getRowsFullTimePredict;
	website.getTeams = getTeamsFullTimePredict;
	website.getPrediction = getPredictionFullTimePredict;
	website.startFromZero = true;
}
function getRowsFullTimePredict(dom){
	var t = dom.querySelectorAll("tr")
	var rows = []
	t.forEach(row=>{
		if(row.children[0].tagName == "TD"){
			rows.push(row)
	    }
	})
	return rows;
}
function getTeamsFullTimePredict(row){
	return row.children[11].innerText.toLowerCase().split(" vs ");
}
function getPredictionFullTimePredict(row){
	return row.children[row.children.length-1].innerText.toUpperCase();
}


//https://www.tips180.com/
function initTips180(website){
	website.link = `https://www.tips180.com/`;
	website.getRows = getRowsTips180;
	website.getTeams = getTeamsTips180;
	website.getPrediction = getPredictionTips180;
	website.startFromZero = true;
}
function getRowsTips180(dom){
	return dom.querySelectorAll("tbody")[0].querySelectorAll("tr");
}
function getTeamsTips180(row){
	let teams = row.children[2].innerText.toLowerCase().split(" vs ");
	return [teams[0].split("\n")[1].replace(/^[^a-z]+/,""),teams[1].replace(/[ ]+$/,"")];
}
function getPredictionTips180(row){
	return row.children[3].innerText;
}


//https://r2bet.com/
function initR2Bet(website){
	website.link = `https://r2bet.com/`;
	website.getRows = getRowsR2Bet;
	website.getTeams = getTeamsR2Bet;
	website.getPrediction = getPredictionR2Bet;
}
function getRowsR2Bet(dom){
	return dom.querySelectorAll("tbody")[2].querySelectorAll("tr");
}
function getTeamsR2Bet(row){
	return row.children[1].innerText.toLowerCase().split("\n")[1].split(" vs ");
}
function getPredictionR2Bet(row){
	return row.children[2].innerText;
}


//https://www.betsloaded.com/
function initBetsLoaded(website){
	website.link = `https://www.betsloaded.com/`;
	website.getRows = getRowsBetsLoaded;
	website.getTeams = getTeamsBetsLoaded;
	website.getPrediction = getPredictionBetsLoaded;
}
function getRowsBetsLoaded(dom){
	return dom.querySelectorAll("tbody")[1].querySelectorAll("tr");
}
function getTeamsBetsLoaded(row){
	return row.children[2].innerText.toLowerCase().split(" vs ");
}
function getPredictionBetsLoaded(row){
	return row.children[3].innerText;
}


//https://allnigeriafootball.com
function initAllNigeriaFootball(website){
	website.link = getTodayAllNigeriaFootball();
	website.getRows = getRowsAllNigeriaFootball;
	website.getTeams = getTeamsAllNigeriaFootball;
	website.getPrediction = getPredictionAllNigeriaFootball;
	website.startFromZero = true;
}
function getTodayAllNigeriaFootball(){
	let monthNames = ["january", "february", "march", "april", "may", "june",
	  "july", "august", "september", "october", "november", "december"];
	let dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	let d = new Date();
	let date = d.getDate();
	let day = d.getDay();
	let month = d.getMonth();
	let year = d.getFullYear();
	let prefix = date == 11 ? "th" : date == 12 ? "th" : date == 13 ? "th" : 
	date % 10 == 1 ? "st" : date % 10 == 2 ? "nd" : date % 10 == 3 ? "rd" : "th";
	return `https://allnigeriafootball.com/sure-prediction-for-today-${dayNames[day]}-${date+prefix}-${monthNames[month]}-${year}/`
}
function getRowsAllNigeriaFootball(dom){
	let t = dom.querySelectorAll("p");
	let rows = [];
	t.forEach(r=>{
		let firstChar = r.innerText.charAt(0);
		if(!isNaN(firstChar) && r.innerText.charAt(0)!=""){
			rows.push(r);
	    }
	})
	return rows;
}
function getTeamsAllNigeriaFootball(row){
	let text = row.innerText.split("\n")[2].toLowerCase().split(/ . /)
	return [text[0],text[1]];
}
function getPredictionAllNigeriaFootball(row){
	return row.innerText.split("\n")[2].split(/ . /)[2];
}


//https://www.sportytrader.com/en/betting-tips/football/
function initSportyTrader(website){
	website.link = `https://www.sportytrader.com/en/betting-tips/football/`;
	website.getRows = getRowsSportyTrader;
	website.getTeams = getTeamsSportyTrader;
	website.getPrediction = getPredictionSportyTrader;
	website.startFromZero = true;
}
function getRowsSportyTrader(dom){
	return dom.getElementsByClassName("betting-cards")[0].querySelectorAll("section");
}
function getTeamsSportyTrader(row){
	return [row.querySelector("span[itemprop='homeTeam']").innerText.toLowerCase().split("\n")[1].replace(/^[^a-z]+/,""),
	row.querySelector("span[itemprop='awayTeam']").innerText.toLowerCase().split("\n")[1].replace(/^[^a-z]+/,"")];
}
function getPredictionSportyTrader(row){
	let home = row.querySelector("span[itemprop='homeTeam']").innerText;
	let pred = specificMapSportyTrader(row.getElementsByClassName("bet-card-our-prono")[0].innerText,home);
	return pred;
}
function specificMapSportyTrader(pred,homeTeam){
	if(!pred.includes("win")) return pred;
	let home = pred.includes(homeTeam) ? "1" : "";
	let draw = pred.includes("Draw") ? "X" : "";
	let away = pred.includes(homeTeam) ? "" : "2";
	return home+draw+away;
}







function Website(){
	this.link;
	this.getRows;
	this.getTeams;
	this.getPredicion;
	this.predictions = [];
}

function Match(){
	this.home;
	this.away;
	this.prediction;
	this.count = 1;
	this.check;
	this.websites = [];
}
function capitalise(s,website,side){
	try{
		return s.replace(/^./,s.match(/^./)[0].toUpperCase())
	}catch(DOMException){
		console.log("*********")
		console.log(website)
		console.log(s);
		console.log(side)
		console.log("*********")
		return s;
	}
}

function getDataFromWebsite(website){
	started ++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            mine(turnToDom(xmlHttp.responseText),website);
            finished++;
            console.log("Finished with: "+website.link)
        }
    }
    xmlHttp.open("GET", website.link, true); // true for asynchronous 
    xmlHttp.send(null);
    console.log("Trying to get: "+website.link)
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}