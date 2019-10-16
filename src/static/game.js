var controller, context, loop, warningImg = '0', name = 'test', sprite = '0.svg';
var imgWarning = document.createElement("img");
var imgWarning2 = document.createElement("img");
imgWarning.src = "pictures/Warningsign.svg";
imgWarning2.src = "pictures/Warningsign2.svg";

let drawSmallLightning = false, drawBigLightning = false;
let drawCloudLeft = false, drawCloudRIght = false;
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

function warning() {
    warningImg = '1'
    warningTimer1 = setInterval(function () {
        if (warningImg === '1') {
            warningImg = '2'
        }
        else if (warningImg === '2') {
            warningImg = '1'
        }

    }, 1000);
    setTimeout(function () {
        clearInterval(warningTimer1);
        warningImg = '0'
    }, 3000)
}

function emitWarning() {
    socket.emit("emitWarning");
}

socket.on('warning', warning);

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
const bigLightning = document.createElement('img');
bigLightning.src = 'pictures/Lange Bliksem.svg';
const smallLightning = document.createElement('img');
smallLightning.src = 'pictures/Bliksem verticaal.svg';
const cloudLeft = document.createElement('img');
cloudLeft.src = 'pictures/Cloudleft.svg';
// const cloudRight = document.createElement('img');
// cloudRight.src = 'pictures/Cloudright.svg';

socket.on('state', function (players, leaderboard) {
    if (context) {
        context.clearRect(0, 0, 2048, 768);
        context.drawImage(background, 0, 0)
        context.drawImage(qrcode, 945, 538)
        context.drawImage(qrcode, 945, 538)

        if (warningImg === '1') {
            context.drawImage(imgWarning, 874, 100);
        }
        else if (warningImg === '2') {
            context.drawImage(imgWarning2, 874, 100);
        }
        for (var id in players) {
            var player = players[id];

            var img = document.createElement('img');
            img.src = `pictures/${player.image}`;

            if (true) {

                if (player.angle === 0) {
                    context.drawImage(img, player.x, player.y); 
                }
                else if (player.angle === -30) {
                    context.translate(player.x, player.y);
                    context.rotate(player.angle * 0.0174532925);
                    context.drawImage(img, 0, 40);
                    context.rotate(-player.angle * 0.0174532925);
                    context.translate(-player.x, -player.y);
                }
                else if (player.angle === -60) {
                    context.translate(player.x, player.y);
                    context.rotate(player.angle * 0.0174532925);
                    context.drawImage(img, -50, 50);
                    context.rotate(-player.angle * 0.0174532925);
                    context.translate(-player.x, -player.y);
                }
                else if (player.angle = -90) {
                    socket.emit('kill');
                }
                else if (player.angle === 30) {
                    context.translate(player.x, player.y);
                    context.rotate(player.angle * 0.0174532925);
                    context.drawImage(img, 0, 40);
                    context.rotate(-player.angle * 0.0174532925);
                    context.translate(-player.x, -player.y);
                }
                else if (player.angle === 60) {
                    context.translate(player.x, player.y);
                    context.rotate(player.angle * 0.0174532925);
                    context.drawImage(img, -50, 50);
                    context.rotate(-player.angle * 0.0174532925);
                    context.translate(-player.x, -player.y);
                }
                else if (player.angle = 90) {
                    socket.emit('kill');
                }
        }
        if (drawBigLightning) {
            context.drawImage(bigLightning, 34, 325)
        }
        if (drawSmallLightning) {
            context.drawImage(smallLightning, -50, 325)
            context.drawImage(smallLightning, 1924, 325)
        }
        if (drawCloudLeft){
            context.drawImage(cloudLeft, 50, 200)
        }
        if (drawCloudRight){
            context.drawImage(cloudRight, 1924, 200)
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
    drawSmallLightning = true;
    setTimeout(function () {
        drawSmallLightning = false;
        drawBigLightning = true;
        if (players) {
            player = players[socket.id];
            if (player && player.jumping == false) {
                socket.emit('kill');
            }
        }
        setTimeout(function () {
            drawBigLightning = false;
        }, 200);
    }, 2000);
});
