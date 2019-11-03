var rows = document.querySelectorAll("tr[class='tr_0'],tr[class='tr_1']")
var matches = [];
rows.forEach(r=>{
	parseRow(r);
})

function parseRow(row){
	try{
		let name = getName(row);
		let selection = getSelection(row);
		let perc = getPerc(row);
		let value = getValue(row);
		matches.push(new Match(name,selection,perc,value));
	}
	catch(e){}
}
function getName(row){
	return row.getElementsByClassName("tnmscn")[0].innerText.split("\n").join(" v ");
}
function getSelection(row){
	return row.getElementsByClassName("forepr")[0].innerText;
}
function getPerc(row){
	return parseFloat(Array.from(row.children).find(c=>c.innerHTML.includes("<b>")).innerText);
}
function getValue(row){
	return parseFloat(row.getElementsByClassName("odds2")[0].innerText.replace(/[-]/,"-1"));
}

function find(selectionRange,percRange,valueRange){
	let toReturn = [];
	matches.forEach(m=>{
		if(isIncluded(m.selection,selectionRange) && isWithinRange(m.perc,percRange) && isWithinRange(m.value,valueRange))
			toReturn.push(m);
	})
	return toReturn;
}
function isIncluded(element,array){
	return array.includes(element);
}
function isWithinRange(value, range){
	return value >= range[0] && value <= range[1];
}

function Match(name,selection,perc,value){
	this.name = name;
	this.selection = selection;
	this.perc = perc;
	this.value = value;
}

//find(["1"],[50,100],[1.2,1.35])
//find(["1"],[50,100],[2.05,100])