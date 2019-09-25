function getAcca(todaysMatches, careAboutUnderdog){
    var acca = [];
    var limit = 3;
    var minHistory = 7;
    var peaks = [0.65, 0.55, 0.80, 0.80, 80];
    for(var i = 0 ; i < todaysMatches.length; i++){
        if(hasEnoughData(todaysMatches[i],minHistory)){
        	var selfPeak = getMinPeak(todaysMatches[i],peaks,careAboutUnderdog);
        	switch(selfPeak){
        		case 0:
        			if(!careAboutUnderdog || (isWithinRange(todaysMatches[i].FT[0],0.45,0.85) && isUnderdog(todaysMatches[i].home.odds)) )
            			checkByDistance(acca,todaysMatches[i],"Home Wins", limit, peaks[0]);
        				break;
        		case 1:
        			if(!careAboutUnderdog || (isWithinRange(todaysMatches[i].FT[2],0.45,0.85) && isUnderdog(todaysMatches[i].away.odds)) )
            			checkByDistance(acca,todaysMatches[i],"Away Wins", limit, peaks[1]);
        				break;
        		case 2:
        			if(!careAboutUnderdog)
            			checkByDistance(acca,todaysMatches[i],"Over 2.5", limit, peaks[2]);
        				break;
        		case 3:
        			if(!careAboutUnderdog)
						checkByDistance(acca,todaysMatches[i],"GG", limit, peaks[3]);
        				break;
        		case 4:
        			if(!careAboutUnderdog)
						checkByDistance(acca,todaysMatches[i],"Over 1.5", limit, peaks[4]);
        				break;
        		default:;
        	}
        }
    }
	return acca;
}
function getMinPeak(match, peakValues, careAboutUnderdog){
	var peaks = [match.FT[0]-peakValues[0],match.FT[2]-peakValues[1],match.O[2]-peakValues[2],match.GG-peakValues[3],match.O[1]-peakValues[4]];
	var min = 0;
	for(var i = 1; i < peaks.length; i++){
		if(careAboutUnderdog && i>=2)
			break;
		if(Math.abs(peaks[i]) < Math.abs(peaks[min])) 
			min = i;
	}
	return min;
}
function checkByDistance(acca, match, text, limit, peak){
	if(acca.length < limit){
		acca.push(new Bet(match,text,priority,peak));
	}else{
		var toReplace = -1;
		toReplace = searchLowestPeak(acca);
		if(toReplace != -1){
			if(Math.abs(peak - getValue(match,text)) < Math.abs(acca[toReplace].peak - getValue(acca[toReplace].match,acca[toReplace].text)) )
				acca[toReplace] = new Bet(match, text, priority, peak);
		}
	}
}
function searchLowestPeak(acca){
	var maxDistance = -1;
	for(var i = 0 ; i < acca.length; i++){
			if(maxDistance == -1)
				maxDistance = i;
			else if(Math.abs(acca[maxDistance].peak - getValue(acca[maxDistance].match, acca[maxDistance].text)) < Math.abs(acca[i].peak - getValue(acca[i].match, acca[i].text)) )
				maxDistance = i;
	}
	return maxDistance;
}

	document.getElementById("todaysAcca").innerHTML = printAcca();
	document.getElementById("showPrev").innerHTML = printPreviousAcca();
	document.getElementById("underdogModalBody").innerHTML = printUnderdogAcca();
