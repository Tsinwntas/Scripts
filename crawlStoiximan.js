var STATES = {
	GET_NEXT_MATCH: 0,
	CLICK_ALL_TAB: 1,
	GET_ODD: 2,
	CLICK_COUPON: 3
}
var DATA = {
	interval: 0,
	currMatch: 0,
	totalMatches: 13,
	crawlled: 0,
	toSuccesfullyCrawl: 1,
	min : 1.15,
	max : 1.28,
	betValue: 0.1
}
var CLASSES = {
	row: "akw",
	matchLink: "ru",
	coupon: "Betting coupon",
	tabs: "a8q",
	oddsPanel: "a8u",
	oddsGroup: "js-market",
	marketTitle: "js-market-title",
	oddTab: "js-selection",
	couponPage: "https://en.stoiximan.com.cy/Upcoming24H/Soccer-FOOT/",
	livePage: "/live/",
	allTabSelected: "mm",
	betSlip: "bet-slip-event"
}
var state = STATES.GET_NEXT_MATCH;
function start(){
	DATA.interval = setInterval(crawl,100);
}
function crawl(){
	try{
		if(!gatheringData() && betsPlaced() >= DATA.totalMatches){
			stop();
			fillBets();
			submitBet();
			return;
		}
		if(gatheringData() && DATA.crawlled >= DATA.toSuccesfullyCrawl){
			stop();
			return;
		}
		if(isAtCouponPage() && state == STATES.GET_NEXT_MATCH){
			clickMatch();
			DATA.currMatch++;
			state = STATES.CLICK_ALL_TAB;
		}else if(isLivePage() && state == STATES.CLICK_ALL_TAB){
			clickCoupon();
			state = STATES.GET_NEXT_MATCH;
		}else if(isAtAllTab()==false && state == STATES.CLICK_ALL_TAB){
			clickAllTab();
			state = STATES.GET_ODD;
		}else if(isAtAllTab() && state == STATES.GET_ODD){
			//getRandomOdd();
			getAllOdds();
			state = STATES.CLICK_COUPON;
		}else if(isAtAllTab() && state == STATES.CLICK_COUPON){
			clickCoupon();
			state = STATES.GET_NEXT_MATCH;
		}
	}catch(err){console.log(err.message);}
}
function stop(){
	clearInterval(DATA.interval);
}
function gatheringData(){
	return DATA.toSuccesfullyCrawl > 0;
}
function betsPlaced(){
	return document.getElementsByClassName(CLASSES.betSlip).length;
}
function  fillBets(){

}
function submitBet(){

}
function clickMatch(){
	document.getElementsByClassName(CLASSES.row)[DATA.currMatch].getElementsByClassName(CLASSES.matchLink)[0].getElementsByTagName("a")[0].click();
}
function clickCoupon(){
	document.querySelectorAll("a[title='"+CLASSES.coupon+"']")[0].click();
}
function clickAllTab(){
	document.getElementsByClassName(CLASSES.tabs)[0].lastElementChild.children[0].click();
}
function getRandomOdd(){
	var markets = document.getElementsByClassName(CLASSES.oddsPanel)[0].getElementsByClassName(CLASSES.oddTab);
	var odds = [];
	for(var i = 0 ; i < markets.length; i ++){
	try{
		if(parseFloat(markets[i].children[1].innerText) >= DATA.min &&parseFloat(markets[i].children[1].innerText) <= DATA.max) {
			odds.push(markets[i]);
	   }
	}catch(d){}
	}
	odds[parseInt(Math.random()*odds.length)].click();

}
function getAllOdds(){
	getMarkets();
	DATA.crawlled++;
}
function getMarkets(){
	var markets = document.getElementsByClassName(CLASSES.oddsGroup);
	for(var m = 0 ; m < markets.length; m++){
		var currMarket = document.getElementsByClassName(CLASSES.marketTitle)[m].innerText;
		console.log(currMarket);
		var currOdds = markets[m].getElementsByClassName(CLASSES.oddTab);
		for(var o = 0; o < currOdds.length; o++){
			console.log(currOdds[o].children[0].innerText + " " + currOdds[o].children[1].innerText);
			map(currMarket,currOdds[o].children[0].innerText,currOdds[o].children[1].innerText)
		}

	}
}
function isAtCouponPage(){
	return this.location.href == CLASSES.couponPage;
}
function isLivePage(){
	return this.location.href.includes(CLASSES.livePage);
}
function isAtAllTab(){
	return document.getElementsByClassName(CLASSES.tabs)[0] && document.getElementsByClassName(CLASSES.tabs)[0].lastElementChild.children[0].className == CLASSES.allTabSelected;
}

function map(oddType, oddSubType, oddValue){
	switch(true){
	}
}
function mapFT(odd,value,map){
		switch(true){
			case odd.includes("1"): map.FT[0] = parseOdd(value);break;
			case odd.includes("X"): map.FT[1] = parseOdd(value);break;
			case odd.includes("2"): map.FT[2] = parseOdd(value);break;
		}
	}
	function mapOU(odd,value,map){
		switch(true){
			case odd.includes("Over 0.5"): map.OU[0] = parseOdd(value);break;
			case odd.includes("Under 0.5"): map.OU[1] = parseOdd(value);break;
			case odd.includes("Over 1.5"): map.OU[2] = parseOdd(value);break;
			case odd.includes("Under 1.5"): map.OU[3] = parseOdd(value);break;
			case odd.includes("Over 2.5"): map.OU[4] = parseOdd(value);break;
			case odd.includes("Under 2.5"): map.OU[5] = parseOdd(value);break;
			case odd.includes("Over 3.5"): map.OU[6] = parseOdd(value);break;
			case odd.includes("Under 3.5"): map.OU[7] = parseOdd(value);break;
			case odd.includes("Over 4.5"): map.OU[8] = parseOdd(value);break;
			case odd.includes("Under 4.5"): map.OU[9] = parseOdd(value);break;
			case odd.includes("Under Over 5.5"): map.OU[10] = parseOdd(value);break;
			case odd.includes("Under 5.5"): map.OU[11] = parseOdd(value);break;
			case odd.includes("Over 6.5"): map.OU[12] = parseOdd(value);break;
			case odd.includes("Under 6.5"): map.OU[13] = parseOdd(value);break;
		}
	}
	function mapGG(odd,value,map){
		switch(true){
			case odd.includes("Yes"): map.GG[0] = parseOdd(value);break;
			case odd.includes("No"): map.GG[1] = parseOdd(value);break;
		}
	}
	function mapHTFT(odd,value,map){
		switch(true){
			case odd.includes("1/1"): map.HTFT[0] = parseOdd(value);break;
			case odd.includes("1/X"): map.HTFT[1] = parseOdd(value);break;
			case odd.includes("1/2"): map.HTFT[2] = parseOdd(value);break;
			case odd.includes("X/1"): map.HTFT[3] = parseOdd(value);break;
			case odd.includes("X/X"): map.HTFT[4] = parseOdd(value);break;
			case odd.includes("X/2"): map.HTFT[5] = parseOdd(value);break;
			case odd.includes("2/1"): map.HTFT[6] = parseOdd(value);break;
			case odd.includes("2/X"): map.HTFT[7] = parseOdd(value);break;
			case odd.includes("2/2"): map.HTFT[8] = parseOdd(value);break;
		}
	}
	function mapDB(odd,value,map){
		switch(true){
			case odd.includes("1X"): map.DoubleChance[0] = parseOdd(value);break;
			case odd.includes("2X"): map.DoubleChance[1] = parseOdd(value);break;
			case odd.includes("12"): map.DoubleChance[2] = parseOdd(value);break;
		}
	}
	function mapFTOU(odd,value,map){
		//console.log("FTOU "+odd+" at "+value);
		switch(true){
			case odd.includes("1 Over 2.5"): map.FTOU[0] = parseOdd(value);break;
			case odd.includes("1 Under 2.5"): map.FTOU[1] = parseOdd(value);break;
			case odd.includes("X Over 2.5"): map.FTOU[0] = parseOdd(value);break;
			case odd.includes("X Under 2.5"): map.FTOU[1] = parseOdd(value);break;
			case odd.includes("2 Over 2.5"): map.FTOU[0] = parseOdd(value);break;
			case odd.includes("2 Under 2.5"): map.FTOU[1] = parseOdd(value);break;
		}
	}
	function mapHT(odd,value,map){
		//console.log("HT "+odd+" at "+value);
		switch(true){
			case odd.includes("1"): map.HT[0] = parseOdd(value);break;
			case odd.includes("X"): map.HT[1] = parseOdd(value);break;
			case odd.includes("2"): map.HT[2] = parseOdd(value);break;
		}
	}
	function mapHTOU(odd,value,map){
		//console.log("HTOU "+odd+" at "+value);
		switch(true){
			case odd.includes("Over 0.5"): map.HTOU[0] = parseOdd(value);break;
			case odd.includes("Under 0.5"): map.HTOU[1] = parseOdd(value);break;
			case odd.includes("Over 1.5"): map.HTOU[2] = parseOdd(value);break;
			case odd.includes("Under 1.5"): map.HTOU[3] = parseOdd(value);break;
			case odd.includes("Over 2.5"): map.HTOU[4] = parseOdd(value);break;
			case odd.includes("Under 2.5"): map.HTOU[5] = parseOdd(value);break;
			case odd.includes("Over 3.5"): map.HTOU[6] = parseOdd(value);break;
			case odd.includes("Under 3.5"): map.HTOU[7] = parseOdd(value);break;
			case odd.includes("Over 4.5"): map.HTOU[8] = parseOdd(value);break;
			case odd.includes("Under 4.5"): map.HTOU[9] = parseOdd(value);break;
			case odd.includes("Under Over 5.5"): map.HTOU[10] = parseOdd(value);break;
			case odd.includes("Under 5.5"): map.HTOU[11] = parseOdd(value);break;
			case odd.includes("Over 6.5"): map.HTOU[12] = parseOdd(value);break;
			case odd.includes("Under 6.5"): map.HTOU[13] = parseOdd(value);break;
		}
	}
