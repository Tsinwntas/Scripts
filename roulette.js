function Odd(c,p,pr){
    this.count = c;
    this.percentage = p;
    this.profit = pr;
}

var odds = [];
var red = [1,3,5,7,9,12,14,16,18,21,23,25,27,30,32,34,36];

//odds["zero"] = new Odd(1,2.7,35);
odds["columnA"] = new Odd(1,32.4,2);
odds["columnB"] = new Odd(1,32.4,2);
odds["columnC"] = new Odd(1,32.4,2);
odds["dozenA"] = new Odd(1,32.4,2);
odds["dozenB"] = new Odd(1,32.4,2);
odds["dozenC"] = new Odd(1,32.4,2);
odds["even"] = new Odd(1,48.6,1);
odds["odd"] = new Odd(1,48.6,1);
odds["red"] = new Odd(1,48.6,1);
odds["black"] = new Odd(1,48.6,1);
odds["high"] = new Odd(1,48.6,1);
odds["low"] = new Odd(1,48.6,1);

var hasBet = false;
var bank = 10;
for(var round = 0; round < 1000; round++ ){
	for(odd in odds){
		if(check(odds[odd],round+1)){
			console.log("Betting "+odd+" in round "+round+" with bank "+bank+".");
			hasBet = true;
			bank -= 1;
			break;
		}
	}
	var result = getResult();
	if(hasBet){
		console.log("Result is #"+result+"!");
		if(compare(odd,result)){
			bank += 1+odds[odd].profit;
			console.log("CORRECT! -- Bank: "+bank+".");
		}else{
			console.log("INCORRECT! -- Bank: "+bank+".");
		}
		hasBet = false;
	}
	logResults(result);
}

function check(o,r){
	return o.count/(1.0*r) <= o.percentage;
}
function getResult(){
	return parseInt(Math.random()*37);
}
function compare(odd,result){
	//if(odd == "zero" && result == 0) return true;
	if(odd == "columnA" && result % 3 == 1) return true;
	if(odd == "columnB" && result % 3 == 2) return true;
	if(odd == "columnC" && result % 3 == 0 && result != 0) return true;
	if(odd == "dozenA" && result >= 1 && result <= 12) return true;
	if(odd == "dozenB" && result >= 13 && result <= 24) return true;
	if(odd == "dozenC" && result >= 25 && result <= 36) return true;
	if(odd == "even" && result % 2 == 0 && result != 0) return true;
	if(odd == "odd" && result % 2 == 1) return true;
	if(odd == "red" && red.includes(result)) return true;
	if(odd == "black" && !red.includes(result) && result != 0) return true;
	if(odd == "high" && result <= 19 && result >= 36) return true;
	if(odd == "low" && result <= 1 && result >= 18) return true;
	return false;
}
function logResults(result){
	//if(result == 0) odds["zero"].count++;
	if(result % 3 == 1) odds["columnA"].count++;
	if(result % 3 == 2) odds["columnB"].count++;
	if(result % 3 == 0 && result != 0) odds["columnC"].count++;
	if(result >= 1 && result <= 12) odds["dozenA"].count++;
	if(result >= 13 && result <= 24) odds["dozenB"].count++;
	if(result >= 25 && result <= 36) odds["dozenC"].count++;
	if(result % 2 == 0 && result != 0) odds["even"].count++;
	if(result % 2 == 1) odds["odd"].count++;
	if(red.includes(result)) odds["red"].count++;
	if(!red.includes(result) && result != 0) odds["black"].count++;
	if(result <= 19 && result >= 36) odds["high"].count++;
	if(result <= 1 && result >= 18) odds["low"].count++;
}