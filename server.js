var http = require('http'),
    io = require('socket.io'),
    sys = require('sys'),
    jade = require('jade');

var pcap = require('pcap');
    
var url = require('url'),
    path = require('path'),
    fs = require('fs');
    
server = http.createServer(function(req, res){
  var uri = url.parse(req.url).pathname;  
  
  if (uri == '/') {
    res.writeHead(200, {'Content-Type': 'text/html'}); 
    jade.renderFile("static/index.jade", {}, function(err, html){
      if (err) { sys.puts(err); }
      res.write(html);
      res.end();
      });
  }
  else {
    var filename = path.join(process.cwd(), "static/" + uri);
    fs.readFile(filename, "binary", function(err, file){  
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
sys.puts("Server running on localhost:8000")

// socket.io 
var socket = io.listen(server); 
socket.on('connection', function(client){   
  client.on('message', function(){ });
  client.on('disconnect', function(){ });
});

// packet capture & processing
FILTER = "tcp port 80";

var tcp_tracker = new pcap.TCP_tracker(),
	pcap_session = pcap.createSession("en1", FILTER);

tcp_tracker.on('http request', function(session, http){
	var pad = function pad(n) { return (n < 10 ? '0' : '') + n};
	var now = new Date();
	timeString = pad(now.getHours()) + ":" + pad(now.getMinutes()) +
	                                   ":" + pad(now.getSeconds());	
	
	msg = JSON.stringify({
      "time": timeString,
      "ip": session.src,
      "host": http.request.headers['Host'],
      "uri": http.request.url,
      "browser": "N/A"
    });
	socket.broadcast(msg);
});

pcap_session.on('packet', function(raw_packet){
    var packet = pcap.decode.packet(raw_packet);
    tcp_tracker.track_packet(packet);
});