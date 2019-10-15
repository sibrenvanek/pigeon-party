var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            break;
        case 87: // W
            movement.up = true;
            break;
        case 68: // D
            movement.right = true;
            break;
        case 83: // S
            movement.down = true;
            break;
    }
});
document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = false;
            break;
        case 87: // W
            movement.up = false;
            break;
        case 68: // D
            movement.right = false;
            break;
        case 83: // S
            movement.down = false;
            break;
    }
});

var socket = io();
socket.on('message', function (data) {
    console.log(data);
});
if (!document.URL.endsWith('overview')) {
    socket.emit('new player');
}

setInterval(function () {
    socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 2048;
canvas.height = 768;
var context = canvas.getContext('2d');

socket.on('state', function (players) {
    context.clearRect(0, 0, 2048, 768);
    for (var id in players) {
        var player = players[id];

        var img = document.createElement('img');
        img.width = 70; img.height = 70;
        img.src = `pictures/${player.image}`;

        context.drawImage(img, player.x, player.y);
    }
});

function killAllPlayers() {
    socket.emit('killAll');
}
