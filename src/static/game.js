var controller, context, loop;
var warningImg = 0;

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

function wind() {
    console.log(' wind');

}




socket.on('state', function (players) {
    if (context) {
        context.clearRect(0, 0, 2048, 768);
        context.strokeStyle = "#202830";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(0, 424);
        context.lineTo(2048, 424);
        context.stroke();

        if (warningImg === '1') {
            context.drawImage(imgWarning, 874, 185);
        }
        else if (warningImg === '2') {
            context.drawImage(imgWarning2, 874, 185);
        }
        for (var id in players) {
            var img = document.createElement('img');
            var player = players[id];
            img.src = `pictures/${player.image}`;
          //  context.drawImage(img, player.x, player.y);
            
            if (true) {
                
              player.angle = 60;
                context.translate(player.x, player.y);
                context.rotate(player.angle * 0.0174532925);
                context.drawImage(img, 80, 5);
                context.rotate(-player.angle * 0.0174532925);
                context.translate(-player.x, -player.y);


                player.angle = 30;
                context.translate(player.x, player.y);
                context.rotate(player.angle * 0.0174532925);
                context.drawImage(img, 25, 55);
                context.rotate(-player.angle * 0.0174532925);
                context.translate(-player.x, -player.y);


                
                player.angle = -60;
                context.translate(player.x, player.y);
                context.rotate(player.angle * 0.0174532925);
                context.drawImage(img, -50, 50);
                context.rotate(-player.angle * 0.0174532925);
                context.translate(-player.x, -player.y);


                player.angle = -30;
                context.translate(player.x, player.y);
                context.rotate(player.angle * 0.0174532925);
                context.drawImage(img, 0, 40);
                context.rotate(-player.angle * 0.0174532925);
                context.translate(-player.x, -player.y);
                
                // player.angle = -30;
                // context.translate(player.x, player.y);
                // context.rotate(player.angle * 0.0174532925);
                // context.drawImage(img, -70, 0);
                // context.rotate(-player.angle * 0.0174532925);
                // context.translate(-player.x, -player.y);

                // if(player.angle = -30)
                // {
                //     player.angle = -60;
                //     context.translate(player.x, player.y);
                //     context.rotate(player.angle * 0.0174532925);
                //     context.drawImage(img, -80, 0);
                //     context.rotate(-player.angle * 0.0174532925);
                //     context.translate(-player.x, -player.y);
                // }
                // if(player.angle = -60)
                // {
                //     player.angle = -90;
                //     context.translate(player.x, player.y);
                //     context.rotate(player.angle * 0.0174532925);
                //     context.drawImage(img, -110, 0);
                //     context.rotate(-player.angle * 0.0174532925);
                //     context.translate(-player.x, -player.y);
                // }
                // if(player.angle = -90)
                // {
                //     socket.emit('kill');
                // }


            }
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
function emitWind() {
    socket.emit("emitWind");
    img.setAttribute('style', 'transform:rotate(180deg)');
}
socket.on('wind', wind)


socket.on('lightning', (players) => {
    player = players[socket.id];
    if (player && player.jumping == false) {
        socket.emit('kill');
    }
});
