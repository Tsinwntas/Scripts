var matchClass = "ai9";
var oddsClass = "a1a";

var matches = document.getElementsByClassName(matchClass);

var ranges = [[1.5,1.59],[1.6,1.69],[1.7,1.79],[1.8,1.89]];
var twoLowest = [];
var twoHighest = [];

fillArrays();


function fillArrays(){
	for( var m = 0; m < matches.length; m ++){
		var h = parseFloat(matches[m].getElementsByClassName(oddsClass)[0].innerText);
		var a = parseFloat(matches[m].getElementsByClassName(oddsClass)[2].innerText);
		matches[m].diff = a - h;
		for(r in ranges){
			if(isWithingRange(h,ranges[r])){
				if(!twoLowest[r]){
					twoLowest[r]=[];
					twoLowest[r][0] = m;
				}
				if(!twoHighest[r]){
					twoHighest[r]=[];
					twoHighest[r][0] = m;
				}
				if(matches[m].diff > 0 && matches[twoLowest[r][0]].diff > matches[m].diff){
					twoLowest[r][1] = twoLowest[r][0];
					twoLowest[r][0] = m;
				}else if(matches[m].diff > 0 && (!twoLowest[r][1] || matches[twoLowest[r][1]].diff > matches[m].diff)) {
					twoLowest[r][1] = m;
				}else if(matches[twoHighest[r][0]].diff < matches[m].diff){
					twoHighest[r][1] = twoHighest[r][0];
					twoHighest[r][0] = m;
				}else if(!twoHighest[r][1] || matches[twoHighest[r][1]].diff < matches[m].diff){
					twoHighest[r][1] = m;
				}
			}
		}
	}
}
function isWithingRange(v,r){
	return v >= r[0] && v <= r[1];
}
function clickHighest(){
	for(r in ranges){
		if(ranges[r]){
			matches[twoHighest[r][0]].getElementsByClassName(oddsClass)[0].click();
			matches[twoHighest[r][1]].getElementsByClassName(oddsClass)[0].click();
		}
	}
}
function clickLowest(){
	for(r in ranges){
		if(ranges[r]){
			matches[twoLowest[r][0]].getElementsByClassName(oddsClass)[0].click();
			matches[twoLowest[r][1]].getElementsByClassName(oddsClass)[0].click();
		}
	}
}