function Match(){
    this.home = [];
    this.away = [];
    this.printInput = function(){
        let out = "";
        for(let i = 0 ; i < 3 ; i++){
            out+= (i != 0 ? " " : "") + normalize(this.home[i]) +" "+ normalize(this.away[i]);
        }
        return out;
    }
    this.printOutput = function(){
        return normalize(this.home[3]) + " " + normalize(this.away[3]);
    }
    this.printFull = function(){
        let out = "";
        for(let i = 0 ; i < 4 ; i++){
            out+= (i != 0 ? " " : "") + this.home[i] +" "+ this.away[i];
        }
        return out;
    }
}
function normalize(v){
    return ((v - 0) / 50.0);
}
function deNormalize(v){
    return (v*50);
}
var links = [];
var interv;
var countInterv;

var matches = [];
var out = "";
var startDate = new Date(2019,0,1);
var endDate = new Date(2019,9,3);
function getData(){
    while(!isEndDate()){
        links.push(`https://www.betexplorer.com/results/basketball/?year=${startDate.getFullYear()}&month=${startDate.getMonth()+1}&day=${startDate.getDate()}`)
        nextDate();
    }
    start();
}
function start(){
    interv = setInterval(()=>{
        getDataFromWebsite(links.splice(0,1)[0])
        if(links.length == 0){
            console.log("done?")
            clearInterval(interv);
        }
    },1);
    countInterv = setInterval(()=>{
        console.log(links.length)
        if(links.length == 0){
            clearInterval(countInterv);
        }
    },1000)
}
function stop(){
    clearInterval(interv);
    clearInterval(countInterv);
}
function isEndDate(){
    return startDate.getYear() == endDate.getYear() && startDate.getMonth() == endDate.getMonth() && startDate.getDate() == endDate.getDate()
}
function nextDate(){
    startDate = new Date(startDate.setDate(startDate.getDate()+1))
}
function moveEndDate(v){
    endDate = new Date(endDate.setDate(endDate.getDate()+v))
}
function getLinks(dom,link){
    Array.from(dom.getElementsByClassName("table-main__tt")).forEach(row=>{
        Array.from(row.getElementsByTagName("a")).forEach(link=>{
            links.push(link.href);
        });
    })
    // console.log("Finished with "+link)
}
var retries = [];
function getScores(dom,link){
    try{
        let scores = dom.getElementsByClassName("list-details__item__partial")[0].innerText.replace(/[(]|[)]/g,"").split(", ");
        let match = new Match();
        for(let i = 0; i < 4; i++){
            let split = scores[i].split(":");
            match.home.push(parseInt(split[0]))
            match.away.push(parseInt(split[1]))
        }
        if(match.home[0] == 0 && match.away[0] == 0) return;
        matches.push(match);
    // console.log("Finished with "+link)
    }catch(e){
        // console.log("Error with "+link);
        // if(!retries.includes(dom.URL)){
        //     retries.push(dom.URL);
        //     console.log("Retrying...")
        //     getDataFromWebsite(dom.URL);
        // }else{
        //     retries.splice(retries.findIndex(l=>l==dom.URL),1);
        // }
    }
}
function printInput(){
    let out = "";
    matches.forEach(m=>{
        out += m.printInput()+"\n";
    })
    console.log(out);
}
function printOutput(){
    let out = "";
    matches.forEach(m=>{
        out += m.printOutput()+"\n";
    })
    console.log(out);
}
function printFull(){
    let out = "";
    matches.forEach(m=>{
        out += m.printFull()+"\n";
    })
    console.log(out);
}
var started = 0;
var finished = 0;
function getDataFromWebsite(link){
	started ++;
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            link.includes("?year")?getLinks(turnToDom(xmlHttp.responseText),link):getScores(turnToDom(xmlHttp.responseText),link);
            finished++;
            // console.log("Finished with: "+link)
        }else if(xmlHttp.status == 408){
            console.log("error");
        }
    }
    xmlHttp.open("GET", link, true); // true for asynchronous 
    xmlHttp.send(null);
    // console.log("Trying to get: "+link)
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}