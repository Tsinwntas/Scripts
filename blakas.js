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
	var nameSpans = document.querySelectorAll("span[itemprop='name']");
	if(nameSpans == undefined || nameSpans.length == 0) return;
	odds[currentLink]={name:nameSpans[0].innerHTML + " - " + nameSpans[1].innerHTML};
	agentState = states.GET_PERCENTAGES;
}
function getPercantages(){}
function calculateOdds(){}
function reset(){
	newWindow.close();
	newWindow = null;
}
function stop(){
	clearInterval(interval);
}