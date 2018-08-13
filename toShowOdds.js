var count =0;
var countFT =0;
var countGG =0;
var countOU =0;
var total =0;
for(var i=0;i < odds.length; i++){
if(odds[i].TOTAL_GAMES_COMPARED && document.getElementsByClassName("l_scr")[i]){ 
if(odds[i].TOTAL_GAMES_COMPARED > 0 && odds[i].TOTAL_GAMES_COMPARED < 10000)
	total++;
console.log(odds[i].name + " " +document.getElementsByClassName("l_scr")[i].innerHTML);
console.log(odds[i].TOTAL_GAMES_COMPARED);
console.log(odds[i].toBet);
console.log("******************");
if(odds[i].TOTAL_GAMES_COMPARED > 0 && odds[i].TOTAL_GAMES_COMPARED < 10000){
	count+= odds[i].toBet.CS == document.getElementsByClassName("l_scr")[i].innerHTML;
	countFT += checkCorrect(odds[i].toBet.FT,document.getElementsByClassName("l_scr")[i].innerHTML.split(" - "))? 1 : 0;
countGG += checkGG(odds[i].toBet.CS.split(" - "),document.getElementsByClassName("l_scr")[i].innerHTML.split(" - "))? 1:0;
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
function ifValid(a,b){}
