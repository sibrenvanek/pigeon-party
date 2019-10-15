var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

const port = 5000;
const maxAmountOfPlayers = 25;

app.set('port', port);

app.use('/static', express.static(__dirname + '/static'));

app.use('/pictures', express.static(__dirname + '/pictures'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/index.html'));
});
app.get('/overview', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/overview.html'));
});

server.listen(port, function () {
    console.log(`🚀  Starting server on port ${port}`);
});

var players = {};
var playerQueue = [];
io.on('connection', function (socket) {
    socket.on('new player', function () {
        const amountOfPlayers = Object.keys(players).length;
        if (amountOfPlayers < maxAmountOfPlayers) {
            addPlayer(socket, amountOfPlayers)
        }
        else {
            playerQueue.push(socket.id);
        }
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
    socket.on('killAll', function () {
        players = {};
        playerQueue = [];
    });
});


setInterval(function () {
    io.sockets.emit('state', players);
}, 1000 / 60);

io.sockets.on('kill', function () {
    console.log(1)
    for (const id in players) {
        const player = players[id];
        if (player.y == 300) {
            const xPos = player.x;
            const yPos = player.y;
            delete players[socket.id]
            addPlayerFromQueue(xPos, yPos)
        }
    }
});

function addPlayer(socket, amountOfPlayers) {
    let xPos = 100 + (amountOfPlayers * 70);
    players[socket.id] = {
        x: xPos,
        y: 300,
        image: Math.round(Math.random() * 30) + '.svg'
    };
}

function addPlayerFromQueue(xPos, yPos) {
    players[playerQueue.shift()] = {
        x: xPos,
        y: yPos,
        image: Math.round(Math.random() * 30) + '.svg'
    }
}
