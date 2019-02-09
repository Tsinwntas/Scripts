getMatchOdds(dom){
	var odds = document.getElementsByClassName("js-selection");
		for(var i =0; i < odds.length; i ++) console.log(odds[i].children[1].innerText);
}