var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static('static'));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '/static/index.html'));
});

// Starts the server.
server.listen(5000, function () {
    console.log('Starting server on port 5000');
});

io.on('connection', function (socket) {
    console.log('player connected');
    socket.on('disconnect', function() {
        console.log('player disconnected');
        delete players[socket.id]
    });
});

setInterval(function () {
    io.sockets.emit('message', 'hi!');
}, 1000);

const players = {};
io.on('connection', function(socket) {
    console.log('new connection')
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
    const player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function() {
    io.sockets.emit('state', players);
  }, 1000 / 60);