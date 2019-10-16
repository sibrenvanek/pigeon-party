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

app.use('/pictures', express.static(__dirname + '/pictures'));

app.use('/css', express.static(__dirname + '/css'));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/startscherm.html'));
});
app.get('/overview', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/overview.html'));
});

app.get('/knoppen', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/knoppen.html'));
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
    socket.on('movement', function (controller) {
        var player = players[socket.id] || {};
        
        if (controller.up && player.jumping == false) 
        {
            player.y_velocity -= 20;
            player.jumping = true;
        }
        player.y_velocity += 1.5;// gravity
        player.x += player.x_velocity;
        player.y += player.y_velocity;
        player.x_velocity *= 0.9;// friction
        player.y_velocity *= 0.9;// friction
        // Rechthoek op lijn laten staan
        if (player.y > 400 - 16 - 32) 
        {
            player.jumping = false;
            player.y = 400 - 16 - 32;
            player.y_velocity = 0;
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
        image: Math.round(Math.random() * 30) + '.svg',
        jumping: false,
        y_velocity: 0,
        x_velocity: 0
    };
}

function addPlayerFromQueue(xPos, yPos) {
    players[playerQueue.shift()] = {
        x: xPos,
        y: yPos,
        image: Math.round(Math.random() * 30) + '.svg'
    }
}
