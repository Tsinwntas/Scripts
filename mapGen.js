function Tile (x,y,up,down,left,right){
	this.x=x;
	this.y=y;
	this.up=up;
	this.down=down;
	this.left=left;
	this.right=right;
}
var sides = {
	RIVER : 1,
	ROAD : 2,
	CITY : 3,
	PLAIN : 4
}
var numberOfDifferentSides;
var readTiles;
var readRiverTiles;
var discardPile;
var map;
var width; 
var height;
var done;
var availableTiles;
var done;
var usedTiles;
function generate(){
	numberOfDifferentSides = 3;
	readTiles = ReadTiles();
	readRiverTiles = ReadRiverTiles();
	discardPile = [];
	map = [];
	width = parseInt(document.getElementById("dimensions").value);
	height = parseInt(document.getElementById("dimensions").value);
	if(!width || width < 5) width = 5;
	if(!height || height < 5) height = 5;
	availableTiles = [];
	done = [];
	usedTiles = [];
	fixMap();
	fillMap();
	printMap();
}

function ReadTiles(){
	var tiles = [];
	var possibilities = [2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,2,2,3,4];
	for(var i =0; i<200 ; i++)
		tiles.push(new Tile(0,0,possibilities[parseInt(Math.random()*possibilities.length)],possibilities[parseInt(Math.random()*possibilities.length)],possibilities[parseInt(Math.random()*possibilities.length)],possibilities[parseInt(Math.random()*possibilities.length)]));
		//tiles.push(new Tile(0,0,parseInt(Math.random()*numberOfDifferentSides)+2,parseInt(Math.random()*numberOfDifferentSides)+2,parseInt(Math.random()*numberOfDifferentSides)+2,parseInt(Math.random()*numberOfDifferentSides)+2));
	return tiles;
}
function ReadRiverTiles(){}
function fixMap(){
	for(var i = 0; i<height ; i++){
		map[i]=[];
		for(var j =0; j<width; j++){
			map[i][j]= new Tile(0,0,0,0,0,0);
			map[i][j].x = j;
			map[i][j].y = i;
			if(i == 0)
				map[i][j].up = 4;
			else if(i == height - 1)
				map[i][j].down = 4;
			if(j == 0)
				map[i][j].left = 4;
			else if(j == width -1)
				map[i][j].right = 4;
		}
	}
}
function fillMap(){
	genRiver();
	while(availableTiles.length != 0){
		var currTile = genNewTile();
		currtile = fitTile(currTile);
		genNewAvailable(currTile);
		console.log(done.length / (1.0*width*height));
	}
}
function genRiver(){
	var side = parseInt(Math.random()*4); 
	var currTile = new Tile(0,0,sides.PLAIN,sides.PLAIN,sides.PLAIN,sides.PLAIN);
	specifySide(currTile,side,sides.RIVER);
	var randX;
	var randY;
	for(var i = 0 ; i< width + height ; i++){
		if(i == 0){
			randX = parseInt(Math.random()*width);
			randY = parseInt(Math.random()*height);
			while(!isValid(map[randY][randX],currTile)){
				randX = parseInt(Math.random()*width);
				randY = parseInt(Math.random()*height);
			}
			currTile.x = randX;
			currTile.y = randY;
			map[randY][randX] = currTile;
			done.push(currTile);
			console.log("Start at "+randX+"-"+randY);
			genNewAvailable(currTile);
			currTile = getRiverFromAvailable();
		}else if(i == width + height -1){
			wrapTile(currTile,sides.PLAIN);
			map[currTile.y][currTile.x] = currTile;
			done.push(currTile);
			console.log("End at "+currTile.y+"-"+currTile.x);
			genNewAvailable(currTile);
		}else{
			var flag = true;
			while(flag){
				side = parseInt(Math.random()*4);
				switch (side){
					case 0: flag = currTile.up != 0;break;
					case 1: flag = currTile.down != 0;break;
					case 2: flag = currTile.left != 0;break;
					case 3: flag = currTile.right != 0;break;
				}
			}
			specifySide(currTile,side,sides.RIVER);
			wrapTile(currTile,sides.PLAIN);
			map[currTile.y][currTile.x] = currTile;
			done.push(currTile);
			genNewAvailable(currTile);
			currTile = getRiverFromAvailable();
		}
	}
}
function genNewTile(){
	var tile = null;
	while(tile == null || !tileFits(tile)){
		if(readTiles.length == 0) mulligan();
		tile = drawTile();
		discardPile.push(tile);
		remove(readTiles,tile);
	}
	return tile;
}
function tileFits(tile){
	for(var i =0 ; i<availableTiles.length;i++){
		if(isValid(availableTiles[i],tile))return true;
	}
	return false;
}
function fitTile(tile){
	var fittingTiles = [];	
	for(var i =0 ; i<availableTiles.length;i++){
		if(isValid(availableTiles[i],tile)) fittingTiles.push(availableTiles[i]);
	}
	var tileToUse = fittingTiles[parseInt(Math.random()*fittingTiles.length)];
	remove(availableTiles,tileToUse);
	tile.y = tileToUse.y;
	tile.x = tileToUse.x;
	map[tileToUse.y][tileToUse.x]=tile;
	done.push(tile);
	return tile;
}
function mulligan(){
	while(discardPile.length>0){
		readTiles.push(discardPile[0]);
		discardPile.splice(0,1);
	}
}
function drawTile(){
	return readTiles[parseInt(Math.random()*readTiles.length)];
}
function genNewAvailable(tile){
	if(tile.y>0 && isFree(tile.x,tile.y-1)){
		map[tile.y-1][tile.x].down=tile.up;
		if(!availableTiles.some(tileEl => tileEl.x == tile.x && tileEl.y == tile.y-1))availableTiles.push(map[tile.y-1][tile.x]);
		else if(!isFree(tile.x,tile.y-1))remove(availableTiles,availableTiles.find(tileEl => tileEl.x == tile.x && tileEl.y == tile.y-1));
	}
	if(tile.y<height-1 && isFree(tile.x,tile.y+1)){
		map[tile.y+1][tile.x].up=tile.down;
		if(!availableTiles.some(tileEl => tileEl.x == tile.x && tileEl.y == tile.y+1))availableTiles.push(map[tile.y+1][tile.x]);
		else if(!isFree(tile.x,tile.y+1))remove(availableTiles,availableTiles.find(tileEl => tileEl.x == tile.x && tileEl.y == tile.y+1));
	}
	if(tile.x>0 && isFree(tile.x-1,tile.y)){
		map[tile.y][tile.x-1].right=tile.left;
		if(!availableTiles.some(tileEl => tileEl.x == tile.x-1 && tileEl.y == tile.y))availableTiles.push(map[tile.y][tile.x-1]);
		else if(!isFree(tile.x-1,tile.y))remove(availableTiles,availableTiles.find(tileEl => tileEl.x == tile.x-1 && tileEl.y == tile.y));
	}
	if(tile.x<width-1 && isFree(tile.x+1,tile.y)){
		map[tile.y][tile.x+1].left=tile.right;
		if(!availableTiles.some(tileEl => tileEl.x == tile.x+1 && tileEl.y == tile.y))availableTiles.push(map[tile.y][tile.x+1]);
		else if(!isFree(tile.x+1,tile.y))remove(availableTiles,availableTiles.find(tileEl => tileEl.x == tile.x+1 && tileEl.y == tile.y));
	}
}
function getRiverFromAvailable(){
	var tile = availableTiles.find(tileEl => tileEl.up == sides.RIVER || tileEl.down == sides.RIVER || tileEl.left == sides.RIVER || tileEl.right == sides.RIVER);
	availableTiles = remove(availableTiles,tile);
	return tile;
}
function isValid(tileA,tileB){
	return (tileA.up==0 || tileA.up == tileB.up) && (tileA.down==0 || tileA.down == tileB.down) && (tileA.left==0 || tileA.left == tileB.left) && (tileA.right==0 || tileA.right == tileB.right);
}
function isFree(x,y){
	return map[y][x].up == 0 || map[y][x].down == 0 || map[y][x].left == 0 || map[y][x].right == 0;
}
function wrapTile(tile,side){
	if(tile.up == 0) tile.up= side;
	if(tile.down == 0) tile.down= side;
	if(tile.left == 0) tile.left= side;
	if(tile.right == 0) tile.right= side;
}
function specifySide(tile,sideToCheck,side){
	switch (sideToCheck){
		case 0: tile.up = side;break;
		case 1: tile.down = side;break;
		case 2: tile.left = side;break;
		case 3: tile.right = side;break;
	}
}
function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
    return array;
}
function printText(){
	for(var i =0;i<height;i++){
		var str = "";
		for(var j =0 ;j < width; j++){
			str += "UP:"+map[i][j].up+" "+"DOWN:"+map[i][j].down+" "+"LEFT:"+map[i][j].left+" "+"RIGHT:"+map[i][j].right+ " | ";
	    }
		console.log(str);
	}
}
function printMap(){
	var mapEl = document.getElementById("map");
	for(var i =0;i<height;i++){
		var row = document.createElement("TR");
    	mapEl.appendChild(row);
		for(var j=0;j<width;j++){
			var col = document.createElement("TD");
			col.innerHTML = "<img src=\"tiles/"+map[i][j].up+""+map[i][j].down+""+map[i][j].left+""+map[i][j].right+".png\"/>";
			row.appendChild(col);
		}
	}
}