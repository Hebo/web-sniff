var socket = new io.Socket('localhost', { port: 8000 }); 
socket.connect();
socket.on('connect', function(){ 
  $('#connect-status').text("Connected")
    .removeClass("unconnected").addClass("connected"); 
}); 

socket.on('message', function(message){  
  var data = JSON.parse(message);
  add_row(data);
}); 

socket.on('disconnect', function(){ 
  $('#connect-status').text("Disconnected")
    .removeClass("connected").addClass("unconnected");
});

$(document).ready( function() {
  $('table').dataTable({
    "bAutoWidth": false
    });
});

function add_row (data) {
	$('table').dataTable().fnAddData([
    data.time,
    data.ip,
    data.host,
    data.uri.slice(0, 30),
    data.browser 
  ]);
}