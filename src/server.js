var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
const port = 5000
app.set('port', port);

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/index.html'));
});

app.get('/knoppen', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/knoppen.html'));
});

server.listen(port, function () {
    console.log(`🚀  Starting server on port ${port}`);
});

var players = {};
io.on('connection', function (socket) {
    socket.on('new player', function () {
        players[socket.id] = {
            x: 300,
            y: 300
        };
    });
    socket.on('movement', function (data) {
        var player = players[socket.id] || {};
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
}); setInterval(function () {
    io.sockets.emit('state', players);
}, 1000 / 60);
