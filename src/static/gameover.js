window.onload = function()
{
    var playerName = document.getElementById("playerName");
    var playerScore = document.getElementById("playerScore");
    var playerImage = document.getElementById("playerImage");

    playerName.innerHTML = localStorage.getItem("playerName");
    playerScore.innerHTML = localStorage.getItem("playerScore");
    playerImage.setAttribute('src', '../pictures/' + localStorage.getItem("playerImage"));


    tryagainButton.onclick = function()
    {
        location.href = "customization";
    }
}