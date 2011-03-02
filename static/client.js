var socket = new io.Socket('localhost', { port: 8000 }); 
socket.connect();
socket.on('connect', function(){ 
  $('#connect-status').text("Connected")
    .removeClass("unconnected").addClass("connected"); 
}); 
socket.on('message', function(message){
  
  data = JSON.parse(message)
  $('table').dataTable().fnAddData([
    data.time,
    data.ip,
    data.host,
    data.uri,
    data.browser 
  ]);
  
}); 
socket.on('disconnect', function(){ 
  $('#connect-status').text("Disconnected")
    .removeClass("connected").addClass("unconnected");
});

$(document).ready( function() {
  $('table').dataTable({
    "bJQueryUI": true,
    "bPaginate": false,
    "bAutoWidth": false
    });
});