var table = document.getElementsByClassName("schema")[0].getElementsByTagName("tbody")[0];
var links = [];
var odds = [];
var newWindow;
var currentLink = 0;
var isWorking = false;
var agentState = 0;
var states = {
	NEW_PAGE : 0,
	GET_NAME : 1,
	GET_PERCENTAGES: 2,
	CALCULATE_ODDS: 3,
	RESET: 4
}
getLinks();
var interval = setInterval(startProcess,100);


function getLinks(){
	for(var i =0; i < table.children.length; i++){
		if(table.children[i].className == "tr_0" || table.children[i].className == "tr_1"){
			links.push(table.children[i].getElementsByTagName("a")[0].href);
		}
	}
}
function startProcess(){
	if(isWorking) return;
	isWorking = true;
	if(currentLink == links.length){
		clearInterval(interval);
		return;
	}
	switch (agentState){
		case states.NEW_PAGE: newPage();break;
		case states.GET_NAME: getName();break;
		case states.GET_PERCENTAGES: getPercentages();break;
		case states.CALCULATE_ODDS: calculateOdds();break;
		case states.RESET: reset();break;
	}
	isWorking = false;
}
function newPage(){
	if(newWindow != null) return;
	newWindow = window.open(links[currentLink]);
	agentState = states.GET_NAME;
}
function getName(){
	if(newWindow == null)
		return;
	var nameSpans = newWindow.document.querySelectorAll("span[itemprop='name']");
	if(nameSpans == undefined || nameSpans.length == 0) return;
	odds[currentLink]={name:nameSpans[0].innerHTML + " - " + nameSpans[1].innerHTML};
	agentState = states.GET_PERCENTAGES;
}
function getPercentages(){
	var homeStats = newWindow.document.getElementsByClassName("statcont")[0].getElementsByTagName("tr");
	var awayStats = newWindow.document.getElementsByClassName("statcont")[1].getElementsByTagName("tr");
	if(homeStats == undefined || awayStats == undefined) return;
	for(var i =0;i<homeStats.length;i++){
		var homeStat = parseFloat(homeStats[i].children[1].innerHTML.split(" ")[0]);
		var awayStat = parseFloat(awayStats[i].children[1].innerHTML.split(" ")[0]);
		switch(i){
			case 0: odds[currentLink].HAGS = homeStat;
			odds[currentLink].AAGS = awayStat;
			break;
			case 1: odds[currentLink].HAGSH = homeStat;
			odds[currentLink].AAGSA = awayStat;
			break;
			case 2: odds[currentLink].HAGC = homeStat;
			odds[currentLink].AAGC = awayStat;
			break;
			case 3: odds[currentLink].HAGCH = homeStat;
			odds[currentLink].AAGCA = awayStat;
			break;
			case 4: odds[currentLink].HU25 = homeStat;
			odds[currentLink].AU25 = awayStat;
			break;
			case 5: odds[currentLink].HO25 = homeStat;
			odds[currentLink].AO25 = awayStat;
			break;
			case 6: odds[currentLink].HU25H = homeStat;
			odds[currentLink].AU25A = awayStat;
			break;
			case 7: odds[currentLink].HO25H = homeStat;
			odds[currentLink].AO25A = awayStat;
			break;
			case 8: odds[currentLink].HGG = homeStat;
			odds[currentLink].AGG = awayStat;
			break;
			case 9: odds[currentLink].HAGSFH = homeStat;
			odds[currentLink].AAGSFH = awayStat;
			break;
			case 10: odds[currentLink].HCS = homeStat;
			odds[currentLink].ACS = awayStat;
			break; 
		}
	}
	agentState = states.CALCULATE_ODDS;
}
function calculateOdds(){
	var match = odds[currentLink];
	if(match.HU25 == NaN || match.AU25 == NaN) return;
	match.toBet ={};
	var matchesPlayed_home = match.HU25 + match.HO25;
	var matchesPlayedHome_home = match.HU25H + match.HO25H;
	var matchesPlayed_away = match.AU25 + match.AO25;
	var matchesPlayedAway_away = match.AU25A + match.AO25A;
	match.TOTAL_GAMES_COMPARED = matchesPlayed_home + matchesPlayed_away;
	checkFT(match);
	checkUO(match);
	//checkGG(match);

	agentState = states.RESET;
}
function checkFT(match){
	var FT = match.HAGS + 1.5*match.HAGSH - match.HAGC - 1.5*match.HAGCH - match.AAGS - 1.5*match.AAGSA + match.AAGC + match.AAGCA;
	match.toBet.FT = FT > 0 ? "1" : FT < 0 ? "2" : "X";
	match.toBet.FT += Math.abs(FT)< 2 && FT != 0 ? "X" : "";
}
function checkUO(match){
	var OU = ((match.HAGS + match.AAGC)/2 + (match.HAGSH + match.AAGCA)/2 + (match.HAGC + match.AAGS)/2 + (match.HAGCH + match.AAGSA)/2)/4;
	match.toBet.UO = (parseInt(OU)+0.5 - OU > 0 ? "U" : "O") + (parseInt(OU)+".5");
}
function reset(){
	if(odds[currentLink].toBet == undefined)return;
	newWindow.close();
	newWindow = null;
	agentState = states.NEW_PAGE;
}
function stop(){
	clearInterval(interval);
}