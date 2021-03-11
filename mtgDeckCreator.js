var cards = getCards(document);
var out = "1x "+document.getElementsByClassName("edhrec2__panel-title edhrec2__panel-card-title")[0].innerText + " *CMDR*";

var cont = document.getElementsByClassName("cardlist__container");

var totalLands = 37;
var bonus = 10;
var list = [];

var lands = cont[cont.length-1]
var landCards = getCards(lands);
var landList = getByUsage(landCards);

var manaRocks = cont[cont.length-2];
var manaRockCards = getCards(manaRocks);
var manaRockList = getByUsage(manaRockCards)

var synergyList = getBySynergy(cards);

fillList(landList, 6);
var landsFilled = list.length;
fillList(manaRockList, 6);
fillList(synergyList, 100 - (totalLands-landsFilled) - list.length + bonus, true);

printList();


function getCards(el){
	return el.getElementsByClassName("card__container");
}

function getByUsage(cards){
	return getByGeneric(cards, 0);
}

function getBySynergy(cards){
	return getByGeneric(cards, 1, true);
}

function getByGeneric(cards, type, skipFirst){
	let list = [];

	for(var c = skipFirst ? 1 : 0; c < cards.length; c++){
    var name = cards[c].getElementsByTagName("img")[0].getAttribute("alt");
    var syn = cards[c].getElementsByClassName("card__label")[0].innerText.split("\n")[type];
    list.push([name, parseInt(syn.split("%")[0])])
	}

	list.sort((a,b)=> b[1]-a[1]);
	return list;
}

function fillList(imported, limit){
	let count = 0;
	for(var i = 0; i < imported.length; i++){
		if(count == limit)
			break;
		if(list.find(c=>c[0] == imported[i][0]) == null){
			list.push(imported[i]);
			count++;
		}
	}
}

function printList(){
	for(var c = 0; c<list.length; c++)
    out+="\n1x "+list[c][0];

	console.log(out)
}

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

