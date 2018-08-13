var count =0;
var countFT =0;
var countGG =0;
var countOU =0;
var total =0;
var scores = [];
var correct=[];
var correctFT=[];
var correctGG=[];
getScores()
for(var i=0;i < odds.length; i++){
	if(odds[i].TOTAL_GAMES_COMPARED > 0 && odds[i].TOTAL_GAMES_COMPARED < 10000 && scores[i]!="")
		total++;
	console.log(odds[i].name + " " +scores[i]);
	console.log(odds[i].TOTAL_GAMES_COMPARED);
	console.log(odds[i].toBet);
	console.log("******************");
	if(odds[i].TOTAL_GAMES_COMPARED > 0 && odds[i].TOTAL_GAMES_COMPARED < 10000 && scores[i]!=""){
		if(odds[i].toBet.CS == scores[i]){
		count++;
		correct.push(odds[i].name + " " +scores[i]+"\n"+odds[i].TOTAL_GAMES_COMPARED+"\n"+JSON.stringify(odds[i].toBet));
	}
	if(checkCorrect(odds[i].toBet.FT,scores[i].split(" - "))){
		countFT ++;
		correctFT.push(odds[i].name + " " +scores[i]+"\n"+odds[i].TOTAL_GAMES_COMPARED+"\n"+JSON.stringify(odds[i].toBet));
	}
	if(checkGG(odds[i].toBet.CS.split(" - "),scores[i].split(" - "))){
		countGG ++;
		correctGG.push(odds[i].name + " " +scores[i]+"\n"+odds[i].TOTAL_GAMES_COMPARED+"\n"+JSON.stringify(odds[i].toBet));
	}
	}
}
console.log(count +" correct out of "+total);
console.log(countFT +" correct FT out of "+total);
console.log(countGG +" correct GG out of "+total);
function checkCorrect(a,b){
switch(a){
    case "1": return parseInt(b[0]) > parseInt(b[1]);
    case "X": return parseInt(b[0]) == parseInt(b[1]);
    case "2": return parseInt(b[0]) < parseInt(b[1]);
    case "1X": return parseInt(b[0]) >= parseInt(b[1]);
    case "2X": return parseInt(b[0]) <= parseInt(b[1]);
}
}
function checkGG(a,b){
return (a[0] >0  && a[1] >0 && b[0] >0 && b[1] >0) || ((a[0] == 0 || a[1] ==0) && (b[0]==0 || b[1] == 0)); 
}
function getScores(){
	var table = document.getElementsByClassName("schema")[0].getElementsByTagName("tbody")[0];
	for(var i =0; i < table.children.length; i++){
		if(table.children[i].className == "tr_0" || table.children[i].className == "tr_1"){
			scores.push(table.children[i].getElementsByClassName("l_scr")[0]?table.children[i].getElementsByClassName("l_scr")[0].innerHTML:"");
		}
	}
}
