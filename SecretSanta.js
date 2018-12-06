var names = `King Bulby, bulbiest of all bulbies
emz
Johny(never skip leg day)
titsiri poullou
Han(D) Solo (6ος)
PC
someone special
Artisti
Avggggggoustinos
MARY PPPPPASIOU
Kyriakos Kazantis
Tsinik Tsinik Tsinik
Man
Aggouraki
Arina
angelos
Kotsios Gurushmas
amapolla`.split("\n");

var tshirtSizes = `XL
s
L/XL
L
M
M/L
S
M
S
S
XL
L
XL
M
M
L
M
S`.split("\n");

var hobbies = `Music. More music. Some more music.
all them musics. thkiavazw, zografizw??
video games/anime/dnd
theatre gym video games
Sex, food, bath
reading, video games, music
science, music, sweets, lame dancing
reading,music, drawing
reading, DnD kai podosfairo
PAINTING, ACTING, TRAVELLING
boardgames dnd
boardgames, crafting, dnd
dnd, liverpool, video games
Music, series, books, concerts(lives) 
Music,trashy shows,theatre
video games ,maskaralikia oti nane
Music instruments, Video game, Volleyball, Science
dance,board games,solving riddles/problems,anime`.split("\n");

var books = `1984, Μην πας ποτέ μόνος στο ταχυδρομείο
hippie,diary of an oxygen thief, [...] polla
hell no...!!
ΦΥΣΙΚΑΙ ΚΑΙ ΟΧΙ!
Με ξένο πρόσωπο
Name of the wind, city of fallen angels
love in the present tense, garbage king
harry potter, his dark materials, artemis fowl, mortal instruments, 1984, και αλλα πολλα
How not to die, Magnesium miracle etc
LEMONY SNICKET, JOHN BOYD (?)
Aggatha cristie Ekdosis Lixnari
detective mitsia
Lord of the Rings, A Song of Fire and Ice
Michael Scott, lemony snicket(thanks Mary) 
the name of the rose, the great gatsby,
meh
Don't bring me a book polx
harry potter, john green`.split("\n");

var movies = `Rick&morty, Arrested Development
friends, gravity falls, sense8, yass disney
MARVEL/STAR WARS FANBOI
SEIRES! PRISONBREAK,VIKINGS.
American Horror Story, Community,  Moana
Gotham, Vikings, marvel
Lucifer, disney, rick&morty, romantic bullshit
harry potter, rent, ALL disney, marvel
Handmaids talke, black mirror, the good doctor
DISNEY
critical role,lord of the rings, gravity falls
matrix, dexter, got, superhero shit, naruto, dbz
Lord of the Rings, A Song of Fire and Ice, Critical role
Series of unfortunate events, Lucifer, Black mirror
Death Note, Vikings, La Casa De papel,kdramas,konstantinou kai elenis
meh
friends, rick&morty, gravity falls
star wars, harry potter disney, fullmetal alchemist, boku no hero academia, big hero six`.split("\n");

var music = `Anything goes. Mainly alt rock
indie,classic/blues/alt.rock,edm?
.
.
What ever, fucking love jazz/blues/rock
passenger, macklemore, 21p
 Queen, imagine dragons, kodaline, mahairitsas
damien rice, madrugada, the national, the neighbourhood, cigarettes after sex, oldies
entexna ellinika alt rock
DISNEY
Pink floyd,Iron Maiden ,metallica, 
manowar ( isitirio g athens enatan kala) & winter's verge
metal.
Alt metal, metalcore, pop rock
80's glam metal, disney, alt rock, (ligo poli to kath eidos ektos apo edm 
lumineers , mumford and sons queen 
pink Floyd, dream theater, guns n roses
linkin park, tripes, panic at the disco,green day`.split("\n");

var other = `voted panda of the year twice. Meme connoisseur
qualified na paiksw meme game me Bulbz, into creepy stuff ;-; secretly a jigglypuff
kapote epaena je kanena futsal mesa mesa....not anymore...#sad
θελω να γινω ο Dan bilzerian, ΘΕΛΩ ΝΑ ΦΚΑΛΩ ΛΕΦΤΑ ΠΟΥ το κουμαρι
I dont know what the fuck just happened. but i dont really care, imma get the fuck out of here. Fuck This Shit I'm Out.
I'm simple I like to be happy :)
Grateful I've been able to travel to a lot of new places lately
waiting for the day I will walk around Nicosia to find TY's quotes 
ταξιδκια.. και μετα αλλο λια ταξιδκια.. και μευα αλλο λια
LOVE IS THE PRESENT, LAW IS FUTURE, CATAN IS THE LIFE -MARY PPASIOU-
estila sas ena shisto epitrapezia p en exo..plus vivlia dnd..gia aggatha cristie ekdosis lixnari exo ta touta 5,16,18,26,29,64,99,123,131,132,137,142,146,150,170,201,205. kai thelo parapolla touta 52,62,103,107,124,174
Agapw ti Meri Pppppasiou.
Geia sou maaaaaaan.
Thanks to whoever is gonna buy me a present??
.
no gay stuff plox lul
oti sou fkalli i fatsa m!
eimai stronjilovounaros`.split("\n");

var emails = `gpanay05@cs.ucy.ac.cy
emilyeliamichael@gmail.com
giannis-k-1994@hotmail.com
michalis.athanasiades1998@gmail.com
dkarletti@gmail.com
petros2612@gmail.com
stephanie29kalli@gmail.com
aristipavlou@gmail.com
avmesaritis@gmail.com 
pasioumary@gmail.com
kyriakoszantis@gmail.com
nicholastsinwntas@gmail.com
markospan13@gmail.com
mariafrangou1997@gmail.com 
arina.aid@gmail.com
asolom06@ucy.ac.cy
rock.ass@hotmail.com
achrys18@ucy.ac.cy`.split("\n");

function sendEmail(){
	document.getElementsByClassName("wO nr")[0].children[1].value = from[count].email;
	document.getElementsByClassName("aoD az6")[0].children[0].value="Secret Santa"
	document.getElementsByClassName("Am Al")[0].innerText=from[count].message;
	//document.getElementsByClassName("T-I J-J5-Ji aoO T-I-atl L3")[0].click();
	count++;
	if(count == from.length) clearInterval(interval);
}
function fixMessage(p){
  p.message = "Victim's Name: "+p.victim.name;
  p.message += "\n";
  p.message += "Victim's Email: "+p.victim.email;
  p.message += "\n";
  p.message += "Tshirt Size: "+p.victim.tshirtSize;
  p.message += "\n";
  p.message += "Hobbies: "+p.victim.hobbies;
  p.message += "\n";
  p.message += "Favorite Books: "+p.victim.books;
  p.message += "\n";
  p.message += "Favorite Movies/Shows: "+p.victim.movies;
  p.message += "\n";
  p.message += "Favorite Music/Artist: "+p.victim.music;
  p.message += "\n";
  p.message += "Random stuff & other notes: "+p.victim.other;
}
function person(){
  this.name ="";
  this.tshirtSize="";
  this.hobbies = "";
  this.books="";
  this.movies="";
  this.music="";
  this.other="";
  this.email ="";
  this.victim;
  this.message = "";
}

var from = [];

for(var i =0; i < names.length ; i++){
  var p = new person();
  p.name=names[i];
  p.tshirtSize = tshirtSizes[i];
  p.hobbies=hobbies[i];
  p.books=books[i];
  p.movies=movies[i];
  p.music=music[i];
  p.other = other[i];
  p.email = emails[i];
  from.push(p);
}

var flag = false;
while(!flag){
	flag= true;
  var to = [];

  for(var i =0 ; i < from.length; i++){
    to.push(from[i]);
  }

  for(var i =0; i < from.length; i++){
    var rand = 0;
    do{
      rand = parseInt(Math.random()*to.length);
    }while(to[rand].email==from[i].email && to.length > 1);
    from[i].victim = to[rand];
    if(from[i].victim.email == from[i].email)
      flag = false;
    to.splice(rand,1);
  }
}
for(var i =0; i < from.length; i++){
  fixMessage(from[i]);
}
console.log(from);

var count = 0;
var interval = setInterval(sendEmail,2000);
