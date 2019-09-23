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
			let curr = predictions.find(p=>p.home==prediction.home && p.away == prediction.away && p.prediction == prediction.prediction)
			if(curr){
				curr.count ++;
			}else{
				predictions.push(prediction)
			}
		})
	})
}
function print(min){
	predictions.forEach(p=>{
		if(p.count > min){
			console.log(p)
		}
	})
}
function initWebsites(){
	let init = [initSoccerPlatform,initSurePredicts,initWizPredict,initMainBet,
	initConfirmBets,initSoloPredict,initSoccerVista,initForeBet,initForeBetOU,
	initBetEnsured,initSupaTips,initBettingClosed,initStatArea];
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
			curr.prediction = mapPrediction(website.getPrediction(row));
			curr.check =  capitalise(curr.home) + " v " + capitalise(curr.away);
			website.predictions.push(curr);
		}
	})
}
function mapPrediction(prediction){
	if(prediction.match(/Ov[0-9]/)){
		prediction = prediction.replace(/Ov/,"Over")
	}
	if(prediction.match(/Un[0-9]/)){
		prediction = prediction.replace(/Un/,"Under")
	}
	if(prediction.match(/Over[0-9]/)){
		prediction = prediction.replace(/Over/,"Over ")
	}
	if(prediction.match(/Under[0-9]/)){
		prediction = prediction.replace(/Under/,"Under ")
	}
	if(prediction.includes("BTTS")){
		prediction = prediction.replace(/BTTS/,"GG")
	}
	if(prediction.includes("BTS")){
		prediction = prediction.replace(/BTS/,"GG")
	}
	switch(true){
		case prediction.includes("x"): return prediction.toUpperCase();
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
	return document.querySelectorAll("tr[role='row']");
}
function getTeamsSoccerPlatform(row){
	let split = row.children[1].innerText.toLowerCase().split(" vs ");
	return [split[0].replace(/[ ]+[(][^)]+[)][ ]*/g,""),split[1].replace(/[ ]+[(][^)]+[)][ ]*/g,"")];
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
		return `https://www.surepredicts.com/${year}/${m}/free-football-predictions-${date}-${month}-${year}.html`
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
	return row.getElementsByClassName("game_match")[1].innerText.toLowerCase().split(" v ");
}
function getPredictionMainBet(row){
	return row.getElementsByClassName("oyes")[0].innerText;
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
	return row.children[4].innerText;
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
}
function capitalise(s){
	return s.replace(/^./,s.match(/^./)[0].toUpperCase())
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