function consoleDisplayString(message){
    $("#debug").append("<p class = 'debug-msg'>"+message+"</p>");
}

$(document).ready(function(){
    displayString("hello world");
});