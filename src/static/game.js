var rectangle, controller, context, loop;
context = document.querySelector("canvas").getContext("2d");
context.canvas.height = 768;
context.canvas.width = 2048;

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

var socket = io();
socket.on('message', function (data) {
    console.log(data);
});
if (!document.URL.endsWith('overview')) {
    socket.emit('new player');
}

socket.emit('new player');
setInterval(function () {
    socket.emit('movement', controller);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 2048;
canvas.height = 768;
var context = canvas.getContext('2d');

socket.on('state', function (players)
{
    context.clearRect(0,0, 2048, 768);
    context.strokeStyle = "#202830";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(0, 384);
    context.lineTo(2048, 384);
    context.stroke();

    for (var id in players) {
        var player = players[id];

        var img = document.createElement('img');
        img.width = 70; img.height = 70;
        img.src = `pictures/${player.image}`;

        context.drawImage(img, player.x, player.y);
    }
});
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);

function killAllPlayers() {
    socket.emit('killAll');
}
