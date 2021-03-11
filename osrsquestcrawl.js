var questList = Array.from(document.getElementsByTagName("tr")).filter(row=>row.children.length==6)
questList.splice(22,1)
questList.splice(0,1);

var quests = [];

questList.forEach((quest,index)=>{
	quests.push(new Quest(getQuestName(quest), getQuestDiff(quest), getQuestLength(quest), getQuestPoints(quest), getGuideLink(quest)));
	getRestOfInfo(index);
})


function getUnlocks(){
	quests.forEach(quest=>{
		quest.questRequirements.forEach((req,index)=>{
			let child = quests.find(q=>q.name.toLowerCase()==req.toLowerCase());
			if(child)
				child.unlocks.push(quest.name);
			else
				quest.questRequirements[index]+= " (mini)";
		});
	})
}

function getQuestName(quest){
	return quest.children[1].innerText;
}

function getQuestDiff(quest){
	return quest.children[2].innerText;
}

function getQuestLength(quest){
	return quest.children[3].innerText;
}

function getQuestPoints(quest){
	return quest.children[4].innerText;
}

function getGuideLink(quest){
	return quest.children[1].children[0].href;
}

function Quest(name, diff, length, points, guide){
	this.name = name;
	this.diff = diff;
	this.length = length;
	this.points = points;
	this.guide = guide;
	this.questRequirements = [];
	this.skillRequirements = [];
	this.unlocks = [];
	this.rewards = "";
	this.completed = false;
}

function SkillRequirement(skill,level,extra){
	this.skill = skill;
	this.level = level;
	this.extra = extra;
}

function getRestOfInfoInDom(index, dom){
	let quest = quests[index];
	var requirements = getRequirements(dom);
	quest.questRequirements = getQuestRequirements(requirements);
	quest.skillRequirements = getSkillRequirements(requirements);
	quest.rewards = getRewards(dom);
}

function getRequirements(dom){
	return Array.from(dom.getElementsByTagName("tr")).filter(r=>r.children[0].innerText == "Requirements")[0].children[1];
}

function getQuestRequirements(requirements){
	questReq = Array.from(requirements.getElementsByTagName("li")).filter(li=>li.children.length==1 && li.children[0].tagName.toLowerCase()=="ul");
	if(questReq == null || questReq.length == 0)
		return [];
	return Array.from(questReq[0].children[0].children).map(child=>child.children[0].innerText)
}

function getSkillRequirements(requirements){
	skillReq = Array.from(requirements.getElementsByTagName("li")).filter(li=>li.textContent.match(/^[ ][0-9]+.*[)]/)).filter(li=>!li.textContent.toLowerCase().includes("quest points"));
	if(skillReq == null || skillReq.length == 0)
		return [];
	return skillReq.map(skill=> {
		let info = skill.innerText;
		let infoSplit = info.split(/[(][^)]+[)]/);
		let skillName = infoSplit[0].replace(/^[ ]/g,"").split(" ")[1];
		let skillLevel = parseInt(infoSplit[0].replace(/^[ ]/g,"").split(" ")[0]);
		return new SkillRequirement(skillName,skillLevel,infoSplit[1]);
	})
}

function getRewards(dom){
	var images = dom.getElementsByClassName("image");
	return images[images.length-1].children[0].src;
}

function getRestOfInfo(index){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            getRestOfInfoInDom(index,turnToDom(xmlHttp.responseText));
        }
    }
    xmlHttp.onerror = function(){
    	console.log("Failed to get Data for "+quests[index].name);
    }
    xmlHttp.open("GET", quests[index].guide, true); // true for asynchronous 
    xmlHttp.send(null);
}
function turnToDom(s){
	var parser = new DOMParser();
  	return parser.parseFromString(s, "text/html");
}


function getQuestSkillXp(){
	var skills = [];
	var t = Array.from(document.getElementsByTagName("table"))
	t.splice(0,1)
	t.forEach(table=>{
	    let skill = table.getElementsByTagName("tr")[0].children[2].innerText.split("\n")[0];
	    skills = skills.concat(Array.from(table.getElementsByTagName("tr")).filter(row=>row.children.length==7).map(r=>{return {skill:skill,quest:r.children[0].innerText,xp:r.children[1].innerText}}))
	})
	skills.forEach(skill=>{
	    if(skill.quest.includes("Recipe for Dis") && skill.quest.includes("\n(")){
	        skill.quest = skill.quest.replace(/[)]/g,"").replace(/[\n][(]/g,"/").replace(/[ ]+subquest.*/g,"")
	          console.log(skill.quest)
	    }

	})
	console.log(JSON.stringify(skills))
}