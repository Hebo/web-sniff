var socket = new io.Socket('localhost', { port: 8000 }); 
socket.connect();
socket.on('connect', function(){ $('#connect-status').text("Connection Active") }); 
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
socket.on('disconnect', function(){ $('#connect-status').text("Disconnected") });

$(document).ready( function() {
  $('table').dataTable({
    "bJQueryUI": true,
    "bPaginate": false,
    "bAutoWidth": false
    });
});