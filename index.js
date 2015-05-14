var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

var serverHash = [];
var clientHash = [];

// Routing
app.use(express.static(__dirname + '/public'));

app.get('/server', function(req, res){
  res.sendFile(__dirname + '/server.html');
});

app.get('/client', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


var ServerSocket = io.of('server');
var ClientSocket = io.of('client');

ServerSocket.on('connection', serverConnectCb);
ClientSocket.on('connection', clientConnectCb);

function serverConnectCb(socket){
    console.log('con ServerSocket socket\'id:', socket.id);
    serverHash.push(socket.id);

    socket.on('disconnect', function(){
        console.log('dis ServerSocket socket\'id:', socket.id);
        serverHash = _.without(serverHash, socket.id);
        console.log(serverHash);
    });
}

function clientConnectCb (socket){
    console.log('con ClientSocket socket\'id:', socket.id);
    clientHash.push(socket.id);

    socket.on('disconnect', function(){
        console.log('dis ClientSocket socket\'id:', socket.id);
        clientHash = _.without(clientHash, socket.id);
        console.log(clientHash);
    });
}




