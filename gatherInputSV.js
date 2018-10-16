var teams = [];
var data = [];
function input(h,a,s){
    this.home = getNumberFromString(h);
	this.away = getNumberFromString(a);
	this.result = isOver(s);
}
function isOver(s){
	return parseInt(s[0])+parseInt(s[1]) > 2.5;
}
function getNumberFromString(s){
	return teams.indexOf(s);
}
function fillTeamsArray(){
	var p = document.getElementsByClassName("predict");
    for(var i =0; i < p.length; i++){
        var h = getHome(p[i]);
        var a = getAway(p[i]);
		if(!teams.includes(h)) teams.push(h);
		if(!teams.includes(a)) teams.push(a);
    }
}
function getData(){
	var p = document.getElementsByClassName("predict");
    for(var i =0; i < p.length; i++){
    	data.push(new input(getHome(p[i]),getAway(p[i]),getScore(p[i])));
    }
}
function getHome(p){
	return p.children[3].innerText;
}
function getScore(p){
	return p.children[4].innerText.split(":");
}
function getAway(p){
	return p.children[5].innerText;
}