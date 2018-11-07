var matches = document.getElementsByClassName("ai9");

var ranges = [[1.5,1.59],[1.6,1.69],[1.7,1.79],[1.8,1.89]];
var odds = [];

fillArrays();


function fillArrays(){
	for( var m = 0; m < matches.length; m ++){
		var h = parseFloat(matches[m].getElementsByClassName("a1a")[0].innerText);
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
				matches[toPick].getElementsByClassName("a1a")[0].click();
			}else{
				i--;
			}
			if( q.length == odds[r].length)break;
		}
	}
}