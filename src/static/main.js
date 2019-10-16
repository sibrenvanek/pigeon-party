window.onload = function()
{
    var startScreen = document.getElementById("start-screen");
    var customizationScreen = document.getElementById("customization-screen");
    var startScreenButton = document.getElementById("startscreen-button");
    var joinButton = document.getElementById("joinButton");

    startScreenButton.onclick = function()
    {
        startScreen.style.display = "none";
        customizationScreen.style.display = "block";
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

}