var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

app.get('/server', function(req, res){
  res.sendFile(__dirname + '/server.html');
});

app.get('/client', function(req, res){
  res.sendFile(__dirname + '/client.html');
});



http.listen(8000, function(){
  console.log('server start -->listening on *:8000');
});

