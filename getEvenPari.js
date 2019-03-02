var ul = "event-view-breadcrumbs__navigation-item";
var linkEl = "live-block-competitors";
var saved = [];
var total = 0;
var done = 0;
var perc;
function mineEvenOdds(){
	var links = getLinks();
	console.log(links.length);
	for( i in links){
		asyncGetEven(links[i]);
	}
	perc = setInterval(percentage,1000);

}
function getEven(dom){
	var selections = dom.getElementsByClassName("event-outcome-group__wrapper");
	console.log(selections);
	for(var i =0; i < selections.length;i ++){
		try{
			var splitted = selections[i].innerText.split("\n");
			console.log(splitted);
			if(splitted[0].replace(/[\n \t]*/g,"") == "Even"){
				//console.log(parseFloat(splitted[3].replace(/[\n \t]*/g,"")));
				if(parseFloat(splitted[1].replace(/[\n \t]*/g,"")) >= 1.9)
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
	var blocks = document.getElementsByClassName(linkEl);
	for(var i = 0 ; i < blocks.length; i ++){
		links.push(blocks[i].href);
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
    	console.log("ASas");
    	done++;
    }
    xmlHttp.open("GET", link, true); // true for asynchronous 
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