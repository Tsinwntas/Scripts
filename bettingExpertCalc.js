function Match(name,betType){
	this.name = name;
	this.betType = betType;
	this.score = 0; 
	this.users = [];
}

var matches = [];
var today = "12th Nov";

function getTips(){
  var rows = document.getElementsByClassName("tip-list-row");
  for(var r =0; r < rows.length; r++){
    var time = getTime(rows[r]);
    if(time.includes(today)){
      var name = getName(rows[r]);
      var betType = getBetType(rows[r]);
      var score = getYield(rows[r]);
      var user = getUser(rows[r]);
      var match = matches.find(function(a){ return a.name == name && a.betType == betType; });
      if(!match){
        match = new Match(name,betType);
        matches.push(match);
      }
      match.score += score;
      match.users.push(user);
    }
  }
}
function getTime(row){
  return row.getElementsByTagName("time")[0].innerText;
}
function getName(row){
  return row.getElementsByClassName("summary")[0].innerText;
}
function getBetType(row){
  var bt = row.getElementsByClassName("tip-selection")[0].innerText.replace(/[\n\s]/g,"");
  if(row.getElementsByClassName("tip-selection")[0].className.includes("has-arrow")){
    if(row.getElementsByClassName("tip-selection-arrow")[0].className.includes("down"))
      bt = "U"+bt;
    else bt = "O"+bt;
  }
  return bt;
}
function getYield(row){
  return parseFloat(row.getElementsByClassName("author-profit")[0].innerText.replace(/[\s%]/g,""));
}
function getUser(row){
  return row.getElementsByClassName("ellipsis")[0].innerText;
}
function mine(d){
	today = d;
	getTips();
	console.log(matches.sort(function(a,b){return b.score - a.score;}));
}
