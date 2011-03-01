var socket = new io.Socket('localhost', { port: 8000 }); 
socket.connect();
socket.on('connect', function(){ $('#cat').append("<p>i am catdog</p>") }) 
socket.on('message', function(message){ $('#cat').append("<p>m: " + message + "</p>") }) 
socket.on('disconnect', function(){ })