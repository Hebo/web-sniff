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
    "aaSorting": [[ 0, "desc" ]],
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "iDisplayLength": 50,
    "oLanguage": {
      "sEmptyTable": "No requests yet",
      "sSearch": "Filter:"  
    },
    "aoColumnDefs": [ 
		  {
			  "fnRender": function ( oObj ) {
          var short_uri = oObj.aData[3].slice(0, 30)
          
				  return "<a target=\"_blank\" href=\"http://" + oObj.aData[2] + oObj.aData[3] + 
				          "\">"+ short_uri +"</a>";
				},
				"aTargets": [3]	
			},
		]
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