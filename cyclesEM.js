var currencies = [];
var exchange = [];
getCurrencies();
blackList();
var interv = setInterval(check,1000);
function check(){
	getExchange();
	bruteForce();
}
function getCurrencies(){
	var p = document.getElementsByClassName("inst-name");
	for(var i =0 ; i < p.length; i ++){ 
		var split = p[i].innerText.split("/");
		if(!currencies.includes(split[0])) currencies.push(split[0]);
		if(!currencies.includes(split[1])) currencies.push(split[1]);
	}
}
function blackList(){
	list = ["XAU","XAG"];
	for(el in list){
		currencies.splice( currencies.indexOf(list[el]), 1 );
	}
}
function getExchange(){
	var p = document.getElementsByClassName("market-explorer")[0].getElementsByTagName("tbody")[0].getElementsByClassName("cp-row");
	for(var i = 0 ; i < p.length; i++){
		var split = p[i].getElementsByClassName("inst-name")[0].innerText.split("/");
		if(!exchange[split[0]]){
			exchange[split[0]] = [];
			exchange[split[0]][split[0]] = 1;
		}
		if(!exchange[split[1]]){
			exchange[split[1]] = [];
			exchange[split[1]][split[1]] = 1;
		}

		exchange[split[0]][split[1]] = parseFloat(p[i].getElementsByClassName("bid")[0].innerText);
		exchange[split[1]][split[0]] = 1 / exchange[split[0]][split[1]];
	}
}
function bruteForce(){
	var value = 0;
	var maxPath = [];
	var maxChain = 4;
	var path = [];

	for(var count = 0; count < Math.pow(currencies.length,maxChain);count++){
		if(count % 10000 == 0 )
			console.log(count*100 /  Math.pow(currencies.length,maxChain));
		for(var position = 0; position < maxChain; position++){
			path[position] = currencies[Math.floor(count/Math.pow(currencies.length,position))%currencies.length];
		}
		var currentValue = chainCalc(path);
		if(maxPath == [] || currentValue > value){
			value = currentValue;
			for(var i = 0; i < path.length; i++)
				maxPath[i] = path[i];
		}
	}
	console.log(maxPath);
	console.log("Value: 1 => "+value);
}
function chainCalc(path){
	try{
		var val = 1*exchange["EUR"][path[0]];
		for(var i = 1 ; i < path.length; i ++){
			val *= exchange[path[i-1]][path[i]];
		}
		val *= exchange[path[path.length-1]]["EUR"];
		if(isNaN(val)) return -1;
		else return val;
	}catch(DOMException){
		return -1;
	}
}