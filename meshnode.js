//include our modules
var util  = require('util');
var http  = require('http');
var url   = require('url');
 
var fs = require('fs');
var port = 8833;

var writeHeadEnd = function(res, type, content, format) {
	res.writeHead(200, {'Content-Type': type});
	res.end(content, 'utf-8');
} 
 
var dispatch = function(req, reqp, res) {
	var serverError = function(code, content) {
		res.writeHead(code, {'Content-Type': 'text/plain'});
		res.end(content);
	}
	
 	switch(reqp.pathname) {
	case "/" :
	case "/meshcraft.html" :
	case "/index.html" :
		fs.readFile('./meshcraft.html', function(error, content) {
			if (error) { serverError(500); return; }
			writeHeadEnd(res, 'text/html', content, 'utf-8');	
		});
	case "/meshcraft.js" :
		fs.readFile('./meshcraft.js', function(error, content) {
			if (error) { serverError(500); return; }
			writeHeadEnd(res, 'text/javascript', content, 'utf-8');	
		});
		break;
	case "/favicon.ico" :
		fs.readFile('./favicon.ico', function(error, content) {
			if (error) { serverError(500); return; }
			writeHeadEnd(res, 'image/x-icon', content, 'binary');
		});
		break;		
	default :
		serverError(404, '404 Bad Request');
		break;
	}
}
 
console.log('Starting server @ http://127.0.0.1:/' + port); 
http.createServer(function (req, res) {
  try {
	var reqp = url.parse(req.url);
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + reqp.href
    ); 
    dispatch(req, reqp, res);
  } catch (err) {
    util.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  } 
}).listen(port, "127.0.0.1", function() {
  console.log('Server running at http://127.0.0.1:/' + port);
});
