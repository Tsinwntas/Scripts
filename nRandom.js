var matchClass = "ai5";
var oddsClass = "a1a";

var matches = document.getElementsByClassName(matchClass);

var ranges = [[1.5,1.59],[1.6,1.69],[1.7,1.79],[1.8,1.89]];
var odds = [];

//fillArrays();


function fillArraysWithRange(){
	for( var m = 0; m < matches.length; m ++){
		var h = parseFloat(matches[m].getElementsByClassName(oddsClass)[0].innerText);
		for(r in ranges){
			if(isWithingRange(h,ranges[r])){
				if(!odds[r]){
					odds[r]=[];
				}
				odds[r].push(m);
			}
		}
	}
}
function isWithingRange(v,r){
	return v >= r[0] && v <= r[1];
}
function clickNOfEach(n){
	for(r in ranges){
		var q = [];
		for(var i =0; i < n; i++){
			if(!ranges[r]) break;
			var toPick = odds[r][parseInt(Math.random()*odds[r].length)];
			if( !q.includes(toPick) ){
				q.push(toPick);
				matches[toPick].getElementsByClassName(oddsClass)[0].click();
			}else{
				i--;
			}
			if( q.length == odds[r].length)break;
		}
	}
}
function fillArraysUnderX(x){
	debugger;
	for( var m = 0; m < matches.length; m ++){
		odds[m] = [];
		var options = matches[m].getElementsByClassName("a1a");
		for(var o = 0; o < options.length; o++){
			var optionValue = parseFloat(options[o].innerText);
			if(!isNaN(optionValue) && optionValue < x){
				odds[m].push(o);
            }
        }
    }
}
function clickN(n){
		var q = [];
		for(var i =0; i < n; i++){
			var matchToPick = parseInt(Math.random()*odds.length);
			if(odds[matchToPick].length == 0 || q.includes(matchToPick)) i--;
			else{
				q.push(matchToPick);
				matches[matchToPick].getElementsByClassName("a1a")[odds[matchToPick][parseInt(Math.random()*odds[matchToPick].length)]].click();
			}
			//if( q.length == odds[r].length)break;
		}
}