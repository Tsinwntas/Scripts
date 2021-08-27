var matches = [];
var currentMatch = 0;
var newWindow;
var isWorking = false;
var agentState = 0;
var states = {
	NEW_PAGE : 0,
	GET_SCORE : 1,
	RESET : 2
}
var interval;
getTodaysMatches();
interval = setInterval(startProcess,100);

function getTodaysMatches(){
	Array.from(document.getElementsByTagName("tr")).forEach(m=>{
		let flag = false;
		Array.from(m.children).forEach(c=>{
			if(c.innerText=="stats"){
				flag= true;
				return;
	        }
		})
		if(flag){
			let match = new Match(getMatchName(m));
			matches.push(match);
			match.link = getLink(m);
			//getDataFromWebsite(getLink(m),match);
		}
	})
}
function getMatchName(match){
	return fixName(match.children[3].innerText) + " v " + fixName(match.children[6].innerText);
}
function fixName(name){
	return name;
}
function getLink(row){
	return row.children[7].children[0].href;
}
function startProcess(){
	if(isWorking) return;
	isWorking = true;
	if(currentMatch == matches.length){
		clearInterval(interval);
		return;
	}
	switch (agentState){
		case states.NEW_PAGE: newPage();break;
		case states.GET_SCORE: getScore();break;
		case states.RESET: reset();break;
	}
	isWorking = false;
}

function newPage(){
	if(newWindow != null) return;
	newWindow = window.open(matches[currentMatch].link);
	agentState = states.GET_SCORE;
}
function getScore(){
	if(newWindow == null)
		return;
	let count = 0;
	let flag = false;
	let goals = [];
	Array.from(newWindow.document.getElementsByTagName("tr")).forEach(m=>{
		Array.from(m.children).forEach(c=>{
			if(c.innerText=="Goals scored"){
				flag= true;
				return;
	        }
		})
		if(flag && count++ < 4)
		goals.push(m);
	})
	if(!flag) return;
	let home = Math.floor((parseFloat(goals[1].children[0].innerText)
	+parseFloat(goals[3].children[4].innerText)) /2);
	let away = Math.floor((parseFloat(goals[3].children[0].innerText)
	+parseFloat(goals[1].children[4].innerText)) /2);
	matches[currentMatch].score = [home,away];
	matches[currentMatch].printMatch();
	agentState = states.RESET;
}
function reset(){
	if(matches[currentMatch].score == [])return;
	newWindow.close();
	newWindow = null;
	agentState = states.NEW_PAGE;
	currentMatch++;
	if(currentMatch == matches.length)
		stop();
}
function stop(){
	clearInterval(interval);
}

function getFromSinglePage(){
	let count = 0;
	let flag = false;
	let goals = [];
	let singleMatch = new Match(document.getElementsByTagName("h1")[0].innerText);
	Array.from(document.getElementsByTagName("tr")).forEach(m=>{
		Array.from(m.children).forEach(c=>{
			if(c.innerText=="Goals scored"){
				flag= true;
				return;
	        }
		})
		if(flag && count++ < 4)
		goals.push(m);
	})
	let home = Math.floor((parseFloat(goals[1].children[0].innerText)
	+parseFloat(goals[3].children[4].innerText)) /2);
	let away = Math.floor((parseFloat(goals[3].children[0].innerText)
	+parseFloat(goals[1].children[4].innerText)) /2);
	singleMatch.score = [home,away];
	singleMatch.printMatch();
}
function Match(name){
	this.name = name;
	this.link;
	this.score = [];
	this.printMatch = function(){
		console.log(this.name+" - ("+this.score[0]+":"+this.score[1]+")");
	}
}
var started = 0;
var finished = 0;
function getDataFromWebsite(link,match){
	started ++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getScore(turnToDom(xmlHttp.responseText),match);
            finished++;
            // console.log("Finished with: "+website.link)
        }
    }
    xmlHttp.open("GET", link, true); // true for asynchronous 
    xmlHttp.send(null);
    console.log("Trying to get: "+link)
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}