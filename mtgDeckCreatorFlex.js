// EDHREC

var cards = getCards(document);
var out = "1x "+document.getElementsByClassName("edhrec2__panel-title edhrec2__panel-card-title")[0].innerText + " *CMDR*";

var cont = document.getElementsByClassName("cardlist__container");
var c = {
	NEW_CARDS : getPosition("New Cards"),
	REPRINTS : getPosition("Reprints"),
	HIGH_SYNERGY_CARDS : getPosition("High Synergy Cards"),
	TOP_CARDS : getPosition("Top Cards"),
	CREATURES : getPosition("Creatures"),
	INSTANTS : getPosition("Instants"),
	SORCERIES : getPosition("Sorceries"),
	UTILITY_ARTIFACTS : getPosition("Utility Artifacts"),
	ENCHANTMENTS : getPosition("Enchantments"),
	PLANESWALKERS : getPosition("Planeswalkers"),
	UTILITY_LANDS : getPosition("Utility Lands"),
	MANA_ARTIFACTS : getPosition("Mana Artifacts"),
	LANDS : getPosition("Lands"),
};

function getPosition(s){
	return getLists().findIndex(l=> l.innerText==s);
}
function getLists(){
	return Array.from(document.getElementsByClassName("edhrec2__button-row-links")[0].getElementsByTagName("li"));
}

var totalLands = 40;
var landsFilled = 0;
var gCards = new Array(getLists().length);
var getByUsageArray = new Array(getLists().length);
var getBySynergyArray = new Array(getLists().length);
var usageNeeds = new Array(getLists().length).fill(0);
var synergyNeeds = new Array(getLists().length).fill(0);

var usageList = getByUsage(cards, true);
var synergyList = getBySynergy(cards, true);

usageNeeds[c.LANDS] = 6;
usageNeeds[c.MANA_ARTIFACTS] = 6

usageNeeds.forEach((a,i)=>{
	var group = cont[i];
	gCards[i] = getCards(group);
	getByUsageArray[i] = getByUsage(gCards[i]);
	getBySynergyArray[i] = getBySynergy(gCards[i]);
});

var list = [];

usageNeeds.forEach((a,i)=>{		
	fillList(getByUsageArray[i], usageNeeds[i]);
	fillList(getBySynergyArray[i], synergyNeeds[i]);
});


fillList(usageList, 0);
fillList(synergyList, 99 - (totalLands-landsFilled) - list.length);
printList();

function getCards(el){
	return el.getElementsByClassName("card__container");
}

function getByUsage(cards, skipFirst){
	return getByGeneric(cards, 0, skipFirst);
}

function getBySynergy(cards, skipFirst){
	return getByGeneric(cards, 1, skipFirst);
}

function getByGeneric(cards, type, skipFirst){
	let list = [];
	for(var c = skipFirst ? 1 : 0; c < cards.length; c++){
		if(isCardBanned(cards[c]))
			continue;
	    var name = getCardName(cards[c]);
	    var value = getCardValue(cards[c], type);
	    list.push([name, value])
	}
	list.sort((a,b)=> b[1]-a[1]);
	return list;
}

function getCardName(card){
	return card.length == 2 ?
		card[0] :
		card.getElementsByTagName("img")[0].getAttribute("alt");
}

function getCardValue(card, type){
	var value = card.getElementsByClassName("card__label")[0].innerText.split("\n")[type];
	return parseInt(value.split("%")[0]);
}

function isCardBanned(card){
	return card.getElementsByClassName("card__banned").length > 0;
}

function fillList(imported, limit){
	let count = 0;
	for(var i = 0; i < imported.length; i++){
		if(count == limit)
			break;
		if(list.find(c=>c[0] == imported[i][0]) == null){
			let land = isLand(imported[i]);
			if(land && totalLands == landsFilled)
				continue;
			if(land)
				landsFilled++;
            else
                count++;
			list.push(imported[i]);
		}
	}
}

function isLand(card){
	return isInGroup(card,c.UTILITY_LANDS) || isInGroup(card,c.LANDS);
}

function isInGroup(card, groupIndex){
	return Array.from(gCards[groupIndex]).find(c=>getCardName(c) == getCardName(card)) != null;
}

function printList(){
	for(var c = 0; c<list.length; c++)
    out+="\n1x "+list[c][0];

	console.log(out)
}


//TAPPED OUT

function getLands(names, perc, has){
	let totalLands = 37;
	if(!has)
		has = getNumOfLands();
	let landOut = "";
	for(var i = 0; i < names.length; i++){
		if(i>0)landOut+="\n";
		landOut+=(Math.round((totalLands-has) * (perc[i]/100))+"x "+names[i]);
	}
	return landOut;
}

function getAmountToRemove(){
	let totalLands = 37;
	return getNumOfCards() - (100 - (totalLands - getNumOfLands()));
}

function getDeckDetails(){
	return document.getElementById("deck-details");
}

function getNumOfCards(){
	return parseInt(Array.from(getDeckDetails().getElementsByTagName("tr")).find(r=>r.innerText.match(/Cards/)).innerText.split(/[\s]/)[1]);
}

function getNumOfLands(){
	return parseInt(Array.from(document.getElementsByTagName("h3")).find(r=>r.innerText.match(/Land/)).innerText.split(/[\s]/)[1].replace(/[(]|[)]/g,""));
}

