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

app.use('/pictures', express.static(__dirname + '/pictures'));

app.use('/css', express.static(__dirname + '/css'));

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/startscherm.html'));
});

app.get('/customization', function(request, response) {
    response.sendFile(path.join(__dirname, 'pages/customization.html'));
});

app.get('/gameover', function (request, response) {
    response.sendFile(path.join(__dirname, 'pages/gameover.html'))
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

let leaderboard = [{ name: 'no player yet', score: 0 }, { name: 'no player yet', score: 0 }, { name: 'no player yet', score: 0 }];

let windActive = false;

io.on('connection', function (socket) {
    socket.on('new player', function (name, sprite = '0.svg') {
        sockets.push(socket);
        if (freeSpaces.length > 0) {
            addPlayer(socket, freeSpaces.shift(), name, sprite);
        }
        else {
            playerQueue.push({ socket, name, sprite });
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
        if (player.y > 340 - 16 - 32) {
            player.jumping = false;
            player.y = 340 - 16 - 32;
            player.y_velocity = 0;
        }

        if (windActive) {
            if (controller.left && player.angle > 0) {
                player.angle -= 30;
            }
            if (controller.right && player.angle < 0) {
                player.angle += 30;
            }
        }
    });

    socket.on('kill', function () {
        killPlayer(socket);
    });

    socket.on('killAll', function () {
        players = {};
        playerQueue = [];
        freeSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        sockets = [];
    });

    socket.on('startLightning', function () {
        setTimeout(startLightning, 3000);
    });

    socket.on('emitWind', function () {
        startWind();
    });

    socket.on('emitWarning', function () {
        socket.emit('warning');
    });

    socket.on('disconnect', function () {
        killPlayer(socket);
        sockets = sockets.filter(socket2 => socket.id !== socket2.id);
    });
});

function killPlayer(socket) {
    const player = players[socket.id];
    if (player) {
        player.score = Math.round((Date.now() - player.startTime) / 100);
        addPlayerToLeaderboard(player);
        const xPos = player.x;
        const yPos = player.y;
        delete players[socket.id];
        if (playerQueue.length > 0) {
            addPlayerFromQueue(xPos, yPos, player.spaceId);
        }
        else {
            freeSpaces.push(player.spaceId);
        }

        socket.emit('gameover',player);
    }
}

function addPlayerToLeaderboard(player) {
    if (leaderboard[0].score < player.score) {
        leaderboard[2].score = leaderboard[1].score;
        leaderboard[2].name = leaderboard[1].name;
        leaderboard[1].score = leaderboard[0].score;
        leaderboard[1].name = leaderboard[0].name;
        leaderboard[0].score = player.score;
        leaderboard[0].name = player.name;
    }
    else if (leaderboard[1].score < player.score) {
        leaderboard[2].score = leaderboard[1].score;
        leaderboard[2].name = leaderboard[1].name;
        leaderboard[1].score = player.score;
        leaderboard[1].name = player.name;
    }
    else if (leaderboard[2].score < player.score) {
        leaderboard[2].score = player.score;
        leaderboard[2].name = player.name;
    }
}

function startLightning() {
    sockets.forEach(socket => {
        socket.emit('lightning', players);
    });
}

function startWind(left = false) {
    windActive = true;
    io.sockets.emit('wind', left);
    changePlayersAngle(left);
    setTimeout(function () {
        changePlayersAngle(left);
        setTimeout(function () {
            changePlayersAngle(left);
            setTimeout(function () {
                changePlayersAngle(left);
                setTimeout(function () {
                    io.sockets.emit('stopWind');
                    windActive = false;
                    const keys = Object.keys(players);
                    keys.forEach(key => {
                        players[key].angle = 0;
                    });
                }, 100);
            }, 1000);
        }, 1000);
    }, 1000);
}

function changePlayersAngle(left) {
    const keys = Object.keys(players);
    keys.forEach(key => {
        if (!left) {
            players[key].angle -= 30;
        }
        else if (left) {
            players[key].angle += 30;
        }
    });
}

function addPlayer(socket, spaceId, name, sprite) {
    let xPos = 100 + (spaceId * 70);
    players[socket.id] = createPlayer(xPos, 300, sprite, false, 0, 0, spaceId, name);
}

function addPlayerFromQueue(xPos, yPos, spaceId) {
    const newPlayer = playerQueue.shift();
    players[newPlayer.socket.id] = createPlayer(xPos, yPos, newPlayer.sprite, false, 0, 0, spaceId, newPlayer.name);
}

function createPlayer(x, y, image, jumping, y_velocity, x_velocity, spaceId, name) {
    return {
        x,
        y,
        image,
        jumping,
        y_velocity,
        x_velocity,
        spaceId,
        name,
        angle: 0,
        startTime: Date.now()
    }
}

startGameLoop();

function startGameLoop() {
    setInterval(function () {
        io.sockets.emit('state', players, leaderboard);
    }, 1000 / 60);

    setInterval(function () {
        let event = Math.round(Math.random() * 4);
        if (event !== 0) {
            io.sockets.emit('warning');
            setTimeout(function () {
                if (event === 1 || event === 2) {
                    io.sockets.emit('lightning', players);
                }
                else if (event === 3 || event === 4) {
                    startWind(event === 3);
                }
            }, 3000);
        }
    }, 10000);
}
