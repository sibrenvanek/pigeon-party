var controller, context, loop, name = 'test', sprite = '0.svg';

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

function buttonUp() {
    controller.up = true;
}

function buttonUpEnd() {
    controller.up = false;
}

function buttonLeft() {
    controller.left = true;
}

function buttonLeftEnd() {
    controller.left = false
}

function buttonRight() {
    controller.right = true;
}

function buttonRightEnd() {
    controller.right = false
}

var socket = io();
socket.on('message', function (data) {
    console.log(data);
});

if (!document.URL.endsWith('overview')) {
    socket.emit('new player', name);
}

setInterval(function () {
    socket.emit('movement', controller);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
var context = undefined;
if (canvas) {
    canvas.width = 2048;
    canvas.height = 768;
    context = canvas.getContext('2d');
}

const plane1Img = document.createElement('img');
plane1Img.src = 'pictures/Plane 1.svg';
const plane2Img = document.createElement('img');
plane2Img.src = 'pictures/Plane 2.svg';
const plane3Img = document.createElement('img');
plane3Img.src = 'pictures/Plane 3.svg';
const background = document.createElement('img');
background.src = 'pictures/Background_V2.svg';
const qrcode = document.createElement('img');
qrcode.src = 'pictures/QR code.svg';

socket.on('state', function (players, leaderboard) {
    if (context) {
        context.clearRect(0, 0, 2048, 768);
        context.drawImage(background, 0, 0)
        context.drawImage(qrcode, 945, 538)

        for (var id in players) {
            var player = players[id];

            var img = document.createElement('img');
            img.src = `pictures/${player.image}`;

            context.drawImage(img, player.x, player.y);
        }
        context.drawImage(plane1Img, 710, 20)
        context.drawImage(plane2Img, 15, 40)
        context.drawImage(plane3Img, 1405, 60)
        context.fillStyle = 'black';
        context.font = '40px heavy_dock11'
        context.fillText(`${leaderboard[0].name}`, 750, 55, 200);
        context.fillText(`${leaderboard[1].name}`, 55, 75, 200);
        context.fillText(`${leaderboard[2].name}`, 1445, 95, 200);
        context.fillText(`${leaderboard[0].score}`, 750, 105, 200);
        context.fillText(`${leaderboard[1].score}`, 55, 125, 200);
        context.fillText(`${leaderboard[2].score}`, 1445, 145, 200);
    }
});
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);

function killAllPlayers() {
    socket.emit('killAll');
}

function startLightning() {
    socket.emit('startLightning');
}

socket.on('lightning', (players) => {
    player = players[socket.id];
    if (player && player.jumping == false) {
        socket.emit('kill');
    }
});
