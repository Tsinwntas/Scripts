function Shop(name, link){
	this.name=name;
	this.link=link;
	this.items = [];
	this.profit = 0;
	this.best = [];
	this.getBest = function(volume){
		var sortedItems = sortItems(this.items);
		for(item in sortedItems){
			if(sortedItems[item] == volume) break;
			if(sortedItems[item].GE > 0 && sortedItems[item].resale-sortedItems[item].GE > 0){
				this.profit+=sortedItems[item].resale-sortedItems[item].GE;
				this.best.push(sortedItems[item]);
			}
		}
	}
}
function Item(){
	this.name;
	this.numberInStock;
	this.price;
	this.resale;
	this.GE;
}

var shops = [];
var gotItems = 0;
function getShops(){
	createShops();
	parseItems();
}
function sortShopItems(){
	for(shop in shops){
		shop.items.sort(function(a,b){return (b.resale-b.GE)-(a.resale-a.GE);});
	}
}
function createShops(){
	var shopsOnPage = document.getElementsByClassName("category-page__member");
	for(var shop=0 ; shop < shopsOnPage.length; shop++){
		shops.push(new Shop(shopsOnPage[shop].children[1].innerText,shopsOnPage[shop].children[1].href));
	}
}
function parseItems(){
	for(var shop in shops){
		goVisit(shops[shop]);
	}
}
function getItems(shop,dom){
	try{
		var itemTable = dom.getElementsByClassName("sortable")[0].getElementsByTagName("tbody")[0];
		for(var item = 0; item < itemTable.children.length; item++){
			try{
				var currentItem = new Item();
				currentItem.name = getItemName(itemTable.children[item]);
				currentItem.numberInStock = getStock(itemTable.children[item]);
				currentItem.price = getPrice(itemTable.children[item]);
				currentItem.resale = getResalePrice(itemTable.children[item]);
				currentItem.GE = getGEPrice(itemTable.children[item]);
				shop.items.push(currentItem);
			}catch(DOMException){}
		}
	}catch(DOMException){
		console.log("Items not found.");
	}
	gotItems++;
	console.log("Done "+(100.0*gotItems)/shops.length+"%");
}
function getItemName(item){
	return item.children[1].innerText;
}
function getStock(item){
	return getNumberFromString(item.children[2].innerText);
}
function getPrice(item){
	return getNumberFromString(item.children[3].innerText);
}
function getResalePrice(item){
	return getNumberFromString(item.children[4].innerText);
}
function getGEPrice(item){
	return getNumberFromString(item.children[5].innerText);
}
function getNumberFromString(string){
	string = string.replace(/[,]/g,"");
	return isNaN(string)||!string?0:parseInt(string);
}
function sortItems(items){
	return items.sort(function(a,b){return (b.resale-(b.GE==0?10000000:b.GE))-(a.resale-(a.GE==0?10000000:a.GE));});
}
function sortShops(volume){
	return shops.sort(function(a,b){
		var shopAProfit = 0;
		var shopBProfit = 0;
		var sortedItemsA = sortItems(a.items);
		var sortedItemsB = sortItems(b.items);
		for(var i =0; i < volume; i++){
			if(i<sortedItemsA.length && sortedItemsA[i].GE > 0 && sortedItemsA[i].resale > sortedItemsA[i].GE)
				shopAProfit+= (sortedItemsA[i].resale - sortedItemsA[i].GE);
			if(i<sortedItemsB.length && sortedItemsB[i].GE > 0 && sortedItemsB[i].resale > sortedItemsB[i].GE)
				shopBProfit+= (sortedItemsB[i].resale - sortedItemsB[i].GE);
		}
		return shopBProfit - shopAProfit;
	});
}
function findBestShops(top,volume){
	for(shop in shops){
		if(shops[shop].best.length == 0)
		shops[shop].getBest(volume);
	}
	shops.sort(function(a,b){return b.profit- a.profit;});
	for(shop = 0; shop < top; shop++){
		console.log(shops[shop].name);
		console.log(shops[shop].profit);
		console.log(shops[shop].best);
	}

}
function goVisit(shop){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getItems(shop,turnToDom(xmlHttp.responseText));
        }
    }
    xmlHttp.open("GET", shop.link, true); // true for asynchronous 
    xmlHttp.send(null);
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}