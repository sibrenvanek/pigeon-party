window.onload = function()
{
    var startScreen = document.getElementById("start-screen");
    var customizationScreen = document.getElementById("customization-screen");
    var gameoverScreen = document.getElementById("gameover-screen");
    var startScreenButton = document.getElementById("startscreen-button");
    var joinButton = document.getElementById("joinButton");
    var tryagainButton = document.getElementById("tryagainButton");
    var birdSvg = document.getElementById("bird-svg");
    var playerName = document.getElementById("playerName");
    var playerScore = document.getElementById("playerScore");
    var playerImage = document.getElementById("playerImage");

    startScreenButton.onclick = function()
    {
        startScreen.style.display = "none";
        customizationScreen.style.display = "block";
        var randomNumber = Math.round(Math.random() * 30);
        localStorage.setItem("randomBirdValue", randomNumber + '.svg');
        birdSvg.setAttribute('src','../pictures/' + randomNumber + '.svg');
    }

    joinButton.onclick = function()
    {
        if(document.getElementById("inputUsername").value == "")
        {
            console.log(document.getElementById("inputUsername").value);
            alert("You cannot join without a username");
        }
        else
        {
            var save = document.getElementById("inputUsername").value;
            localStorage.setItem("inputUsername", save);
            location.href = "knoppen";
            setTimeout(function(){
                startScreen.style.display = "none";
                customizationScreen.style.display = "none";
                gameoverScreen.style.display = "block";
            },3500);
        }
    }

    playerName.innerHTML = localStorage.getItem("playerName");
    playerScore.innerHTML = localStorage.getItem("playerScore");
    playerImage.setAttribute('src', '../pictures/' + localStorage.getItem("playerImage"));


    tryagainButton.onclick = function()
    {
        location.href = "/";
    }
}