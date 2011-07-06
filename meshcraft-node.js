//include our modules
var sys   = require('sys');
var http  = require('http');
var url   = require('url');
 
var fs = require('fs');
var port = 8833;
 
var actions = {
  'view' : function(user) {
    return '<h1>Todos for ' + user + '</h1>';
  }
}
 
var dispatch = function(req, res) {
  var serverError = function(code, content) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(content);
  }
 
  var renderHtml = function(content) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(content, 'utf-8');
  } 
  var parts = req.url.split('/');
 
  if (req.url == "/") {
    fs.readFile('./meshcraft.html', function(error, content) {
      if (error) {
        serverError(500);
      } else {
        renderHtml(content);
      }
    });
  }
}
 
console.log('Starting server @ http://127.0.0.1:/' + port); 
http.createServer(function (req, res) {
  //wrap calls in a try catch
  //or the node js server will crash upon any code errors
  try {
    //pipe some details to the node console
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + url.parse(req.url).href
    );
 
    //dispatch our request
    dispatch(req, res);
  } catch (err) {
    //handle errors gracefully
    sys.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  } 
 
}).listen(port, "127.0.0.1", function() {
  //runs when our server is created
  console.log('Server running at http://127.0.0.1:/' + port);
});

//var http = require('http');
//http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello Node.js\n');
//}).listen(8124, "127.0.0.1");
//console.log('Server running at http://127.0.0.1:8124/');