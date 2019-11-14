window.addEventListener("load", start);

function start() {
    var submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click", envia);
}

function envia() {
    var username = document.getElementById("username").value;
    var gunNum = document.getElementById("gunNum").value;
    setCookie("username",username,1);
    setCookie("gunNum",gunNum,1);

    window.location.assign("http://"+window.location.hostname+":"+window.location.port+"/game.html");
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}