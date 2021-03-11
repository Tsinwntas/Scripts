function clearUploads(){
	Array.from(document.getElementsByClassName("dz-remove")).forEach(e=>e.click());
}

function hideExisting(){
	$('.result').hide();
}

function hideExceptLast(x){
	var a = $('.result');
	$('.result:lt('+(a.length-x)+')').hide();
}

async function addSongsToPlaylist(playlist){
	var a = Array.from(document.querySelectorAll("div:not([style*='display:none']):not([style*='display: none'])[class='myaudio result']"))
	for(var i =0 ; i < a.length; i++){
		a[i].getElementsByClassName("addtolist")[0].click();
		await sleep(150);
		var b = document.getElementsByClassName("selectize-dropdown-content");
		Array.from(b[b.length-1].children).find(l=>l.innerText == playlist).click();
		await sleep(150);
	}
}

function setOverallVolume(volume){
	Array.from(document.querySelectorAll("input[class='slider']")).forEach(e =>{
		e.value=volume;
		$(e).first().trigger("change",volume);
	})
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

