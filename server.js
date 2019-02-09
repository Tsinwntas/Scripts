var http = require ('http');
function onRequest(request, response){
	response.write('Sup.');
	response.end();
}
http.createServer(onRequest).listen(8000);