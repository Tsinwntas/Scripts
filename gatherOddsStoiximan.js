var STATES={
	WAIT_FOR_COUPON_TO_LOAD:0,
	WAIT_FOR_MATCH_TO_LOAD:1,
	FIND_NEXT_MATCH:2,
	STOP:3
}
var ELEMENTS={
	MATCH_LINK: "ru",
	COUPON_HEADER: "zo",
	MATCH_LOADED: "a8o",
	COUPON_LOADED: "js-league-sortby"
}
var ranges = [[1.1,1.24]];

var dom = document;
var match;
var state;
var interval;
function start(){
	reset();
	//openNewTab();
	interval = setInterval(stateChecker,1000);
}
function stateChecker(){
	switch(state){
		case STATES.FIND_NEXT_MATCH:
			var match = getNextMatch();
			if(match){
				match.click();
				state = STATES.WAIT_FOR_MATCH_TO_LOAD;
			}
			break;
		case STATES.WAIT_FOR_MATCH_TO_LOAD:
			if(matchLoaded()){
				getAllOddsWithinRange();
				clickCoupon();
				state = STATES.WAIT_FOR_COUPON_TO_LOAD;
			}
			break;
		case STATES.WAIT_FOR_COUPON_TO_LOAD:
			if(couponLoaded()){
				state = STATES.FIND_NEXT_MATCH;
			}
			break;
		case STATES.STOP:
			clearInterval(interval);
			break;
	}
}
function reset(){
	match = 0;
	state = STATES.WAIT_FOR_COUPON_TO_LOAD;
}
function getNextMatch(){
	var matches = getMatches();
	if(match >= matches.length){
		state = STATES.STOP;
		return null;
	}
	return getMatch(matches,match);
}
function getMatches(){
	return dom.getElementsByClassName(ELEMENTS.MATCH_LINK);
}
function getMatch(matches, match){
	return matches[match].children[0];
}
function matchLoaded(){
	return dom.getElementsByClassName(ELEMENTS.MATCH_LOADED);
}
function getAllOddsWithinRange(){
	var odds = getOdds();
	for(var o = 0 ; o < odds.length; o++){
		if(isWithinRangeArray(getValue(odds[o]))){
			odds[o].click();
		}
	}
}
function getOdds(){
	return dom.getElementsByClassName("js-selection");
}
function isWithinRangeArray(value){
	for(r in ranges){
		if(isWithinRange(value,ranges[r]))
			return true;
	}
	return false;
}
function isWithinRange(v,r){
	return v >= r[0] && v <= r[1];
}
function getValue(odd){
	return parseString(odd.innerText);
}
function parseString(s){
	return parseFloat(s.replace(/[ \t\n]/g,""));
}
function clickCoupon(){
	dom.getElementsByClassName(ELEMENTS.COUPON_HEADER)[0].getElementsByTagName("a")[0].click();
}
function couponLoaded(){
	return dom.getElementById("js-league-sortby");
}