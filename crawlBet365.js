var isEnglish = true;
var isFirstTime = true;
var isCrawlling = false;
var matches = [];
var mass = 0;
var count = 0;
var crawlling;
function start(){
	crawlling = setInterval(crawl,500);
}
function crawl(){
	matches = [];
	if(!isEnglish)turnToEnglish();
	else if(isAtHomePage())clickTodaysMatches();
	else if(inListView()){
		if(isFirstTime){
			mass = getNumberofMatches();
			count= 0;
			isFirstTime = false;
		}else{
			if(!matches[count]){
				matches[count] = 1;
				isCrawlling = false;
				clickMatch(count);
			}else if(matches[count] != 1){
				count++;
				if(count >= mass)
					clearInterval(crawlling);
			}
		}
	}
	else if(inLiveView()){
		goToListView();
	}
	else if(inMatchView()&&!isCrawlling){
		isCrawlling = true;
		crawlMatch(count);
		goToListView();
	}
}
function turnToEnglish(){
	document.getElementsByClassName("hm-DropDownSelections_Button")[0].click()
	document.getElementsByClassName("hm-DropDownSelections_Item")[0].click();
	isEnglish = true;
}
function isAtHomePage(){
	return document.getElementsByClassName("wn-Classification_Home")[0].className.includes("Selected");
}
function clickTodaysMatches(){
	document.getElementsByClassName("tc-TopCouponLinkButton")[0].click();
}
function inListView(){
	return document.getElementsByClassName("cl-BreadcrumbTrail_Breadcrumb").length == 2;
}
function getNumberofMatches(){
	return document.getElementsByClassName("sl-CouponFixtureLinkParticipant_Name").length;
}
function clickMatch(match){
	document.getElementsByClassName("sl-CouponFixtureLinkParticipant_Name")[match].click();
}
function inMatchView(){

}
function crawlMatch(){
	console.log("gathered match "+count);
}
function goToListView(){
	document.getElementsByClassName("cl-BreadcrumbTrail_Breadcrumb cl-BreadcrumbTrail_BreadcrumbTruncate")[0].click();
}