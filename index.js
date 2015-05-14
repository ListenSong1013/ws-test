var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');
require('colors');

var clientHash = {};
var connectHash = {};

// Routing
// app.use(express.static(__dirname + '/public'));

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

http.listen(3000, function(){
  console.log('server start -->listening on *:3000'.green);
});


var ClientSocket = io.of('client');

ClientSocket.on('connection', clientConnectCb);

function clientConnectCb (socket){
  var socket_id = socket.id;
  var socket_query = socket.handshake.query;
  console.log('con ClientSocket socket\'id and query:'.yellow, socket_id, socket_query);
  var username = socket_query.username;

  socket.emit('client list', clientHash, function(ret){
    console.log('client list ack:'.yellow + ret);
  });


  console.log(clientHash)
  _.each(clientHash, function(item, index){
    ClientSocket.connected[index].emit('client online', {id:socket_id,username: username} , function(ret){
      console.log('client online ack:'.yellow + ret);
    });
  });

  clientHash[socket_id] = username;
  connectHash[socket_id] = socket;

  socket.on('disconnect', function(){
      console.log('dis ClientSocket socket\'id:', socket.id);
      delete clientHash[socket_id];
      delete connectHash[socket_id];

      _.each(clientHash, function(item, index){
        ClientSocket.connected[index].emit('client offline', {id:socket_id,username: username} , function(ret){
          console.log('client online ack:'.yellow + ret);
        });
      });
  });
}




