window.addEventListener("load", start);

function start() {
    var submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click", envia);
}

function envia() {
    var username = document.getElementById("username").value;
    console.log("Username login: "+username);
    setCookie("username",username,1);
    window.location.assign("http://192.168.14.122:3000/game.html");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }