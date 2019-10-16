window.onload = function()
{
    var joinButton = document.getElementById("joinButton");
    var birdSvg = document.getElementById("bird-svg");

    var randomNumber = Math.round(Math.random() * 30);
    localStorage.setItem("randomBirdValue", randomNumber + '.svg');
    birdSvg.setAttribute('src','../pictures/' + randomNumber + '.svg');

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
}