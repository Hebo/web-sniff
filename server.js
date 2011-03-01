var http = require('http'),
    io = require('socket.io'),
    sys = require('sys'),
    jade = require('jade');
    
var url = require('url'),
    path = require('path'),
    fs = require('fs');
    
server = http.createServer(function(req, res){
  var uri = url.parse(req.url).pathname;  
  
  if (uri == '/') {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    jade.renderFile("index.jade", {}, function(err, html){
      if (err) { sys.puts(err); }
      res.write(html);
      res.end();
      });
  }
  else {
    var filename = path.join(process.cwd(), "static/" + uri);
    fs.readFile(filename, "binary", function(err, file) {  
      if(err) {  
        res.writeHead(500, {"Content-Type": "text/plain"});  
        res.write(err + "\n");  
        res.end();  
        return;  
      }  
      res.writeHead(200);  
      res.write(file, "binary");  
      res.end();
    });
  } 
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