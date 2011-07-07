//include our modules
var sys   = require('sys');
var http  = require('http');
var url   = require('url');
 
var fs = require('fs');
var port = 8833;
  
var dispatch = function(req, res) {
	var serverError = function(code, content) {
		res.writeHead(code, {'Content-Type': 'text/plain'});
		res.end(content);
	}
 
	var renderHtml = function(content) {
		res.writeHead(200, 
			{'Content-Type': 'text/html'}
		);
		res.end(content, 'utf-8');
	} 

	var renderPng = function(content) {
		res.writeHead(200, {
			'Content-Type': 'image/png'
		});
		res.end(content, "binary");
	} 
	
	var renderIco = function(content) {
		res.writeHead(200, {
			'Content-Type': 'image/x-icon'
		});
		res.end(content, "binary");
	} 

  
	if (req.url == "/favicon.png") {
		fs.readFile('./favicon.png', function(error, content) {
			if (error) {
				serverError(500);
			} else {
				renderPng(content);
			}
		});
	} else if (req.url == "/favicon.ico") {
		fs.readFile('./favicon.ico', function(error, content) {
			if (error) {
				serverError(500);
			} else {
				renderIco(content);
			}
		});
	} else if (req.url == "/" || req.url == "/meshcraft.html" || req.url == "/index.html") {
		fs.readFile('./meshcraft.html', function(error, content) {
			if (error) {
				serverError(500);
			} else {
				renderHtml(content);
			}
		});
	} else {
		serverError(404, '404 Bad Request');
	}
}
 
console.log('Starting server @ http://127.0.0.1:/' + port); 
http.createServer(function (req, res) {
  try {
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + url.parse(req.url).href
    ); 
    dispatch(req, res);
  } catch (err) {
    sys.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  } 
 
}).listen(port, "127.0.0.1", function() {
  console.log('Server running at http://127.0.0.1:/' + port);
});
