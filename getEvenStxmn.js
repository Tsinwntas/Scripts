var ul = "a8p";
var linkEl = "ru";
var saved = [];
var total = 0;
var done = 0;
var perc;
function mineEvenOdds(){
	var links = getLinks();
	for( i in links){
		asyncGetEven(links[i],i);
	}
	perc = setInterval(percentage,1000);

}
function getEven(dom,id){
	var selections = dom.getElementsByClassName("js-selection");
	for(var i =0; i < selections.length;i ++){
		try{
			var splitted = selections[i].innerText.split("\n");
			if(splitted[2].replace(/[\n \t]*/g,"") == "Odd"){
				//console.log(parseFloat(splitted[3].replace(/[\n \t]*/g,"")));
				if(parseFloat(splitted[3].replace(/[\n \t]*/g,"")) >= 1.9)
				saveMatch(dom,id);
			}
		}catch(DOMException){}
	}
}
function saveMatch(dom,id){
	var list = dom.getElementsByClassName(ul)[0];
	saved.push([id,list.children[list.children.length - 1].innerText]);
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
function asyncGetEven(link,i){
	console.log("UNCLOG");
	total++;
	try{
		var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() { 
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
	            getEven(turnToDom(xmlHttp.responseText),i);
				done++;
	        }
	    };
	    xmlHttp.onerror = function(err){
	    	console.log("Failed to get Data for "+i);
	    	done++;
	    };
	    if(!link) throw DOMException;
	    xmlHttp.open("GET", link+"?bt=2", true); // true for asynchronous 
	    xmlHttp.send(null);
	}catch(DOMException){
		console.log("Failed to get Data for "+i);
		done++;
	}
}
function percentage(){
	console.log(done/total*100+"%");
	if(done == total){
		clearInterval(perc);
		print();
	}
}
function print(){
	console.log(saved.sort(function(a,b){return a[0] - b[0];}));
}
function debug(d){
	console.log(d);
	return true;
}