var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

function buttonUp()
{
    movement.up = true;
}

function buttonUpEnd()
{
    movement.up = false;
}

function buttonDown()
{
    movement.down = true;
}

function buttonDownEnd()
{
    movement.down = false
}

function buttonLeft()
{
    movement.left = true;
}

function buttonLeftEnd()
{
    movement.left = false
}

function buttonRight()
{
    movement.right = true;
}

function buttonRightEnd()
{
    movement.right = false
}

/* document.addEventListener('keydown', function (event) {
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
}); */

/* document.addEventListener('keyup', function (event) {
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
}); */

var socket = io();
socket.on('message', function (data) {
    console.log(data);
});
if (!document.URL.endsWith('overview')) {
    socket.emit('new player');
}

socket.emit('new player');
setInterval(function () {
    socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 2048;
canvas.height = 768;
var context = canvas.getContext('2d');
socket.on('state', function (players) {
    context.clearRect(0, 0, 2048, 768);
    context.fillStyle = 'green';
    for (var id in players) {
        var player = players[id];
        context.beginPath();
        context.arc(player.x, player.y, 25, 0, 2 * Math.PI);
        context.fill();

        // var img = document.createElement('img');

        // img.onload = function () {
        //     ctx.drawImage(this, 0, 0);
        // }

        // img.src = 'pictures/Bird.svg';
        // img.width = 60; img.height = 60;
    }
});

function killAllPlayers() {
    socket.emit('killAll');
}
