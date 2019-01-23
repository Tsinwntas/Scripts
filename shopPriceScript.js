function shop(){
	this.name;
	this.link;
	this.items = [];
}
function item(){
	this.name;
	this.numberInStock;
	this.price;
	this.resale;
	this.GE;
}

shops = [];

function getShops(){
	createShops();
	parseItems();
}
function createShops(){
	
}