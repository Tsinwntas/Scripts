var matchResults = [];
var teams = [];


var FT="";
var GG="";
var O25="";
var CSv1="";
var CSv2="";


function fillTeams(){
  for(var i = 0; i < matchResults.length; i++){
    if(teams.indexOf(matchResults[i].home)==-1){
      teams.push(matchResults[i].home);
    }
    if(teams.indexOf(matchResults[i].away)==-1){
      teams.push(matchResults[i].away);
    }
  }
}

function fixData(){
  for(var i = 0; i < matchResults.length; i++){
    var home = fixTeam(matchResults[i].home);
    var away= fixTeam(matchResults[i].away);
    var score = matchResults[i].score.split(":");
    score[0] = parseInt(score[0]);
    score[1] = parseInt(score[1]);
    var scoreFT = fixFT(score);
    var scoreGG = fixGG(score);
    var scoreO25 = fixO25(score);
    var scoreCSv1 = fixCSv1(score);
    var scoreCSv2 = fixCSv2(score);
    if(i > 0 ){
      FT+="\n";
      GG+="\n";
      O25+="\n";
      CSv1+="\n";
      CSv2+="\n";
    }
      FT+=home+" "+away+" "+scoreFT;
      GG+=home+" "+away+" "+scoreGG;
      O25+=home+" "+away+" "+scoreO25;
      CSv1+=home+" "+away+" "+scoreCSv1;
      CSv2+=home+" "+away+" "+scoreCSv2;
  }
}
function fixTeam(team){
  return normalise(teams.indexOf(team),0,teams.length-1);
}
function fixFT(score){
  if(score[0] > score[1]) return "1 0 0";
  if(score[0] < score[1]) return "0 0 1";
  if(score[0] == score[1]) return "0 1 0";
}
function fixGG(score){
  return ((normalise(Math.min(score[0],3), 0, 3) + 1) / 2) + " " + ((normalise(Math.min(score[1],3), 0, 3) + 1) / 2);
}
function fixO25(score){
  return ((normalise(Math.min(score[0]+score[1],5), 0, 5) + 1) / 2);
}
function fixCSv1(score){
  var scoreString="";
  for(var i = 0;i<score[0];i++){
    if(i>0) scoreString+=" ";
    if(i == score[0]-1) scoreString += "1";
    else scoreString += "0";
  }
  for(var i = 0;i<score[1];i++){
    if(i == score[0]-1) scoreString += " 1";
    else scoreString += " 0";
  }
  return scoreString;
}
function fixCSv2(score){
  return ((normalise(Math.min(score[0],5), 0, 5) + 1) / 2) + " " + ((normalise(Math.min(score[1],5), 0, 5) + 1) / 2);
}
function normalise(value, min, max){
  return (1.0 * (value - min) / (max - min)) * 2 - 1
}
function denormalise(value, min, max){
  return (value + 1) / 2.0 * ( max - min) + min;
}