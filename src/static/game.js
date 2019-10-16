var controller, context, loop, warningImg = '0';
var imgWarning = document.createElement("img");
var imgWarning2 = document.createElement("img");
imgWarning.src = "pictures/Warningsign.svg";
imgWarning2.src = "pictures/Warningsign2.svg";




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
    socket.emit('new player');
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

function warning()
{
    warningImg = '1'
    warningTimer1 = setInterval(function(){
        if (warningImg === '1')
        {
            warningImg = '2' 
        }
        else if(warningImg === '2')
        {
            warningImg = '1'
        }
        
    }, 1000);
   setTimeout(function(){
       clearInterval(warningTimer1);
       warningImg = '0'
   }, 3000)
}

function emitWarning()
{
    socket.emit("emitWarning");
}

socket.on('warning', warning);

socket.on('state', function (players) {
    if (context) {
        context.clearRect(0, 0, 2048, 768);
        context.strokeStyle = "#202830";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(0, 424);
        context.lineTo(2048, 424);
        context.stroke();

        if (warningImg === '1')
        {
            context.drawImage(imgWarning, 874, 185);
        }
        else if (warningImg === '2')
        {
            context.drawImage(imgWarning2, 874, 185);
        }
        for (var id in players) {
            var player = players[id];

            var img = document.createElement('img');
            img.width = 70; img.height = 70;
            img.src = `pictures/${player.image}`;

            context.drawImage(img, player.x, player.y);
        }
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
