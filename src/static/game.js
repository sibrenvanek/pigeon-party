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

rectangle = {

    height: 32,
    jumping: true,
    width: 32,
    x: 1024, // center of the canvas
    x_velocity: 0,
    y: 0,
    y_velocity: 0

};


controller = {
    left: false,
    right: false,
    up: false,
    keyListener: function (event) {
        var key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
            case 38:// up key
                controller.up = key_state;
                break;
        }

    }

};



socket.on('state', function (players)
{
    context.fillStyle = "#000000";
    context.fillRect(0, 0, 2048, 768);
    context.fillStyle = 'blue';

    if (controller.up && rectangle.jumping == false) 
    {
        rectangle.y_velocity -= 20;
        rectangle.jumping = true;
    }
    rectangle.y_velocity += 1.5;// gravity
    rectangle.x += rectangle.x_velocity;
    rectangle.y += rectangle.y_velocity;
    rectangle.x_velocity *= 0.9;// friction
    rectangle.y_velocity *= 0.9;// friction

    // Rechthoek op lijn laten staan
    if (rectangle.y > 400 - 16 - 32) 
    {

        rectangle.jumping = false;
        rectangle.y = 400 - 16 - 32;
        rectangle.y_velocity = 0;

    }

    context.fillStyle = "#000000";
    context.fillRect(0, 0, 2048, 768);
    context.fillStyle = "#ff0000";// hex for red
    context.beginPath();
    context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.fill();
    context.strokeStyle = "#202830";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(0, 384);
    context.lineTo(2048, 384);
    context.stroke();

    
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
