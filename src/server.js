var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

const port = 5000;

app.set('port', port);

app.use('/static', express.static(__dirname + '/static'));

app.use('/pictures', express.static(__dirname + '/pictures'))

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/index.html'));
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

let players = {};
let playerQueue = [];
let freeSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
let sockets = [];

io.on('connection', function (socket) {
    socket.on('new player', function () {
        sockets.push(socket);
        if (freeSpaces.length > 0) {
            addPlayer(socket, freeSpaces.shift())
        }
        else {
            playerQueue.push(socket.id);
        }
    });

    socket.on('movement', function (controller) {
        var player = players[socket.id] || {};

        if (controller.up && player.jumping == false) {
            player.y_velocity -= 20;
            player.jumping = true;
        }
        player.y_velocity += 1.5;// gravity
        player.x += player.x_velocity;
        player.y += player.y_velocity;
        player.x_velocity *= 0.9;// friction
        player.y_velocity *= 0.9;// friction
        // Rechthoek op lijn laten staan
        if (player.y > 400 - 16 - 32) {
            player.jumping = false;
            player.y = 400 - 16 - 32;
            player.y_velocity = 0;
        }
    });

    socket.on('kill', function () {
        killPlayer(socket);
    });

    socket.on('killAll', function () {
        players = {};
        playerQueue = [];
        freeSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    });

    socket.on('startLightning', function () {
        setTimeout(startLightning, 3000);
    });

    socket.on('disconnect', function () {
        killPlayer(socket);
        sockets = sockets.filter(socket2 => socket.id !== socket2.id);
    });
});

function killPlayer(socket) {
    const player = players[socket.id];
    if (player) {
        const xPos = player.x;
        const yPos = player.y;
        delete players[socket.id];
        if (playerQueue.length > 0) {
            addPlayerFromQueue(xPos, yPos, player.spaceId);
        }
        else {
            freeSpaces.push(player.spaceId);
        }
    }
}

setInterval(function () {
    io.sockets.emit('state', players);
}, 1000 / 60);

function startLightning() {
    sockets.forEach(socket => {
        socket.emit('lightning', players);
    });
}

function addPlayer(socket, spaceId) {
    let xPos = 100 + (spaceId * 70);
    players[socket.id] = createPlayer(xPos, 300, Math.round(Math.random() * 30) + '.svg', false, 0, 0, spaceId);
}

function addPlayerFromQueue(xPos, yPos, spaceId) {
    players[playerQueue.shift()] = createPlayer(xPos, yPos, Math.round(Math.random() * 30) + '.svg', false, 0, 0, spaceId);
}

function createPlayer(x, y, image, jumping, y_velocity, x_velocity, spaceId) {
    return {
        x,
        y,
        image,
        jumping,
        y_velocity,
        x_velocity,
        spaceId
    }
}
