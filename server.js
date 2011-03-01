var http = require('http'),
    io = require('socket.io'),
    sys = require('sys');
    
server = http.createServer(function(req, res){ 
 // your normal server code 
 res.writeHead(200, {'Content-Type': 'text/html'}); 
 res.end('<h1>Hello world</h1>'); 
});
server.listen(8000);

// socket.io 
var socket = io.listen(server); 
socket.on('connection', function(client){ 
  // new client is here! 
  sys.puts("client here")
  client.send("Your number is " + client.sessionId)
  
  client.on('message', function(){ sys.puts("message") }) 
  client.on('disconnect', function(){ sys.puts("dced") }) 
});