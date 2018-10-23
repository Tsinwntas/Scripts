function Match(home, away, score, dateTime){
  this.home = home;
  this.away = away;
  this.score = score;
  this.dateTime = dateTime;
}

var p = document.getElementsByClassName("stage-finished");
var matchTable = [];
for(var i =0; i < p.length; i ++){
	matchTable.push(new Match(getHome(p[i]),getAway(p[i]),getScore(p[i]),getDateTime(p[i])));
} 

matchTable.sort(function(a,b){return tsiniksAmazingMath(a,b)});

function getHome(el){
  return el.getElementsByClassName("team-home")[0].children[0].innerText;
}
function getAway(el){
  return el.getElementsByClassName("team-away")[0].children[0].innerText;
}
function getScore(el){
  return el.getElementsByClassName("score")[0].innerText.replace(/[^0-9:]/g,"");
}
function getDateTime(el){
  return el.getElementsByClassName("time")[0].innerHTML.replace(/[ ]/g,"").replace(/[:]/g,".").split(".");
}
function tsiniksAmazingMath(a,b){
  return (10000*(parseInt(a.dateTime[0])+parseInt(a.dateTime[1])*35) + (parseInt(a.dateTime[3]) + parseInt(a.dateTime[2])*60)) - (10000*(parseInt(b.dateTime[0])+parseInt(b.dateTime[1])*35) + (parseInt(b.dateTime[3]) + parseInt(b.dateTime[2])*60));
}

console.log(JSON.stringify(matchTable));