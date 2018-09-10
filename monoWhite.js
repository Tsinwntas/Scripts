var noteMap = [];
var speeds = [1,2,4,8,16];
var secondsToPlay = 60;
var noteMapLength = secondsToPlay*8;
var normalNumberOfKeys = 109;
var notes = [];
initWhiteNotes();
var numberOfKeys = notes.length;
var usedNotes = [];
var newNotes = [];
initMap();
initNotes();
createRestOfNotes();
addNotesToMap();
var count = 0;
var interval = setInterval(playNote,125);
function Note(pos,speed,rank){
	this.pos=pos;
	this.speed=speed;
	this.rank = rank;
}
function initMap(){
	for(var i = 0; i<noteMapLength;i ++){
		noteMap[i]=[];
	}
}
function initNotes(){
	var rand = 50;//parseInt(Math.random()*50);
	newNotes.push(new Note(parseInt(Math.random()*16),speeds[parseInt(Math.random()*speeds.length)],parseInt(Math.random()*numberOfKeys)));
	for(var i = 0; i < rand; i++){
		newNotes.push(randomNote());
	}
}
function randomNote(){

	return new Note(parseInt(Math.random()*noteMapLength),parseInt(Math.random()*speeds.length),parseInt(Math.random()*numberOfKeys/2 + (numberOfKeys/4)));
}
function createRestOfNotes(){
	while(newNotes.length>0){
		var currNote = newNotes.splice(0,1)[0];
		var newPos = currNote.pos+speeds[currNote.speed];
		if(newPos < noteMapLength){
			var newSpeed = getNewSpeed(currNote.speed);
			var numberOfKids =parseInt(Math.random()*2)+1;
			if(Math.random()>0.4){
				for(var i = 0; i < numberOfKids; i++){
					newNotes.push(new Note(newPos,newSpeed,getNewRank(currNote.rank)));
				}
			}
		}
		usedNotes.push(currNote);
	}
}
function getNewSpeed(speed){
	var rand = Math.random();
	if(rand < 0.1){
		if(Math.random()<0.5){
			speed+=2;
			if(speed==speeds.length)speed-=2;
		}else{
			speed-=2;
			if(speed>0)speed+=2;
		}
	}
	else if(rand < 0.8){
		if(Math.random()<0.5){
			speed+=1;
			if(speed==speeds.length)speed-=1;
		}else{
			speed-=1;
			if(speed>0)speed+=1;
		}
	}
	return speed;
}
function getNewRank(rank){
	var side = 1;
	var move = 0;
	
	if(rank < 25 && Math.random()<0.2)
		side*=-1;
	else if(rank > numberOfKeys-26 && Math.random()<0.8)
		side*=-1;
	else if(Math.random()<0.5)
		side*=-1;
	var rand = Math.random();
	if(rand <0.05){
		move*= parseInt(Math.random()*5+11)
	}
	else if(rand < 0.30){
		move*= parseInt(Math.random()*5+6)
	}
	else if(rand < 0.85){
		move*= parseInt(Math.random()*5+1)
	}
	rank += move*side;
	if(rank < 0) rank = numberOfKeys/2;
	else if(rank >= numberOfKeys) rank =  numberOfKeys/2;
	return rank;
}
function addNotesToMap(){
	for(noteIndex in usedNotes){
		var pos = usedNotes[noteIndex].pos;
		if(noteMap[pos].length < 4 && !noteMap[pos].includes(notes[usedNotes[noteIndex].rank]))
			noteMap[pos].push(notes[usedNotes[noteIndex].rank]);
	}
}
function playNote(){
	for(note in noteMap[count]){
		presspianokey(noteMap[count][note]);
		releasepianokey(noteMap[count][note]);
	}
	count++;
	if(count==noteMapLength)clearInterval(interval);
}
function initWhiteNotes(){
	var count = 0;
	for(var i = 0 ; i < normalNumberOfKeys; i++ ){
		if(count == 12 ) count =0;
		if(count < 5 && count%2 == 0)
			notes.push(i);
		else if( count > 4 && count%2 == 1) 
			notes.push(i);
		count++;
	}
}