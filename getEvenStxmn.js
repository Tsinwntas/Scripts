var ul = "a8p";
var linkEl = "ru";
var saved = [];
var total = 0;
var done = 0;
var perc;
function mineEvenOdds(){
	var links = getLinks();
	for( i in links){
		asyncGetEven(links[i]);
	}
	perc = setInterval(percentage,1000);

}
function getEven(dom){
	var selections = dom.getElementsByClassName("js-selection");
	for(var i =0; i < selections.length;i ++){
		try{
			var splitted = selections[i].innerText.split("\n");
			if(splitted[2].replace(/[\n \t]*/g,"") == "Even" || splitted[2].replace(/[\n \t]*/g,"") == "Odd"){
				//console.log(parseFloat(splitted[3].replace(/[\n \t]*/g,"")));
				if(parseFloat(splitted[3].replace(/[\n \t]*/g,"")) >= 2)
				saveMatch(dom);
			}
		}catch(DOMException){}
	}
}
function saveMatch(dom){
	var list = dom.getElementsByClassName(ul)[0];
	saved.push(list.children[list.children.length - 1].innerText);
}
function getLinks(){
	var links = [];
	var list = document.getElementsByClassName(linkEl);
	for(var i = 0 ; i < list.length; i ++){
		if(list[i].children.length > 0)
		links.push(list[i].children[0].href);
	}
	return links;
}

function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}
function asyncGetEven(link){
	total++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getEven(turnToDom(xmlHttp.responseText));
			done++;
        }
    }
    xmlHttp.onerror = function(){
    	//console.log("Failed to get Data for "+currentDate.stringForm);
    	done++;
    }
    xmlHttp.open("GET", link+"?bt=2", true); // true for asynchronous 
    xmlHttp.send(null);
}
function percentage(){
	console.log(done/total*100+"%");
	if(done == total){
		clearInterval(perc);
		print();
	}
}
function print(){
	console.log(saved);
}
function debug(d){
	console.log(d);
	return true;
}