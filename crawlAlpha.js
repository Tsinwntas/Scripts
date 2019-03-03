var count = 0;
var bet = 0;
var state = 0;
var interv;

function print(){
	console.log("Bet: "+bet);
	console.log("Count: "+count);
}

function AI(){
	try{
		if(bet>=7){
			print();
			clearInterval(interv);
			return;
		}
		if(state == 0){
			getNextMatch();
		}else if(state == 1){
			getRange(1.1,1.35);
			//getLowestOdd();
		}
	}catch(e){
		print();
		clearInterval(interv);
	}
}
function getNextMatch(){
	var odds = document.getElementsByClassName("market-open");
	var matches = document.querySelectorAll("div[class=moremarkets]");
	if(odds && odds.length > 0) return;
	if(!matches || matches.length==0) return;
	if(!kids()){
		matches[count].click();
		state++;}
	else 
		count++;
}
function getRange(min,max){
	var odds = document.getElementsByClassName("market-open");
	var matches = document.querySelectorAll("div[class=moremarkets]");
	var options = [];
	if(matches && matches.length > 0) return;
	if(!odds || odds.length==0) return;
	var p=document.getElementsByClassName("selection");
	for(var i=0;i<p.length;i++){
		if(!isNaN(p[i].innerHTML)){
			if(parseFloat(p[i].innerHTML)>=min && parseFloat(p[i].innerHTML)<=max)
				options.push(i);
		}
	}
	if(options != [] ){
		p[options[parseInt(Math.random()*options.length)]].click();
		bet++;
	}
	document.getElementsByClassName("go-back")[0].click();
	count++;
	state=0;
}
function getLowestOdd(){
	var odds = document.getElementsByClassName("market-open");
	var matches = document.querySelectorAll("div[class=moremarkets]");
	if(matches && matches.length > 0) return;
	if(!odds || odds.length==0) return;
	var min=0;
	var p=document.getElementsByClassName("selection");
	for(var i=0;i<p.length;i++){
		if(!isNaN(p[i].innerHTML)){
			if(parseFloat(p[i].innerHTML)<parseFloat(p[min].innerHTML))min =i;
		}
	}
	if(!isFootball() || ( parseFloat(p[min].innerHTML)<1.10 && min>5 ) ){
		p[min].click();
		bet++;
	}
	document.getElementsByClassName("go-back")[0].click();
	count++;
	state=0;
}
function kids(){
	var kidNames=["YOUTH", "ESTUDAN", "UNIVER", "U17", "U19", "U20", "U21"];
	var matchNames = getMatchNames();
	for(var i=0; i< kidNames.length; i++){
		if(matchNames.includes(kidNames[i]))
			return true;
	}
	return false;
};
function getMatchNames(){
	return document.getElementsByClassName("match-name-link")[count].innerHTML;
}
function isFootball(){
	return document.getElementsByClassName("sports-menu-item")[0].className.indexOf("selected") > -1;
}

interv=setInterval(AI,100);