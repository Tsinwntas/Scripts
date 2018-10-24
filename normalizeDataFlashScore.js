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

function decodeFT(s){
  s = s.split("\n");
  for(var i =0 ; i< s.length; i ++){
    if( i % 2 == 0){
      var h = parseFloat(s[i].split(" ")[0]);
      var a = parseFloat(s[i].split(" ")[1]);
      h = denormalise(h, 0, teams.length -1);
      a = denormalise(a, 0, teams.length -1);
      console.log(teams[Math.round(h)] + " - " + teams[Math.round(a)]);
    }else{
      var tScore = s[i].split(" ");
      var toPrint = "";
      var h = parseFloat(tScore[0]);
      var x = parseFloat(tScore[1]);
      var a = parseFloat(tScore[2]);
      if(h > 0.4) toPrint += "1("+parseInt(h*100)+"%) ";
      if(x > 0.4) toPrint += "X("+parseInt(x*100)+"%) ";
      if(a > 0.4) toPrint += "2("+parseInt(a*100)+"%) ";
      console.log(toPrint);
    }
  }
}
function decodeO25(s){
  s = s.split("\n");
  for(var i =0 ; i< s.length; i ++){
    if( i % 2 == 0){
      var h = parseFloat(s[i].split(" ")[0]);
      var a = parseFloat(s[i].split(" ")[1]);
      h = denormalise(h, 0, teams.length -1);
      a = denormalise(a, 0, teams.length -1);
      console.log(teams[Math.round(h)] + " - " + teams[Math.round(a)]);
    }else{
      var score = parseFloat(s[i]);
      var OU = "O";
      if(score < 0.4) OU = "U";
      console.log(OU+"2.5("+parseInt((0.5+Math.abs(0.5-score))*100)+"%)");
    }
  }
}
function decodeGG(s){
  s = s.split("\n");
  for(var i =0 ; i< s.length; i ++){
    if( i % 2 == 0){
      var h = parseFloat(s[i].split(" ")[0]);
      var a = parseFloat(s[i].split(" ")[1]);
      h = denormalise(h, 0, teams.length -1);
      a = denormalise(a, 0, teams.length -1);
      console.log(teams[Math.round(h)] + " - " + teams[Math.round(a)]);
    }else{
      var tScore = s[i].split(" ");
      var toPrint = "";
      var h = parseFloat(tScore[0]);
      var a = parseFloat(tScore[1]);
      toPrint += "homeToScore("+parseInt(h*100)+"%) ";
      toPrint += "awayToScore("+parseInt(a*100)+"%)";
      console.log(toPrint);
    }
  }
}