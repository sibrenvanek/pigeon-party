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
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);

function killAllPlayers() {
    socket.emit('killAll');
}
