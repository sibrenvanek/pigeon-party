window.onload = function()
{
    var startScreen = document.getElementById("start-screen");
    var customizationScreen = document.getElementById("customization-screen");
    var gameoverScreen = document.getElementById("gameover-screen");
    var startScreenButton = document.getElementById("startscreen-button");
    var joinButton = document.getElementById("joinButton");
    var tryagainButton = document.getElementById("tryagainButton");
    var birdSvg = document.getElementById("bird-svg");

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
            location.href = "knoppen";
        }
    }

    tryagainButton.onclick = function()
    {
        gameoverScreen.style.display = "none";
        customizationScreen.style.display = "block";
    }
}