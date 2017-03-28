
// Box width
var bw = 2000;
// Box height
var bh = 500;

var canvas = document.getElementById("grid-render");
var context = canvas.getContext("2d");
function drawBoard(){
for (var x = 0; x <= bw; x += 50) {
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, bh + p);
}


for (var x = 0; x <= bh; x += 50) {
    context.moveTo(p, 0.5 + x + p);
    context.lineTo(bw + p, 0.5 + x + p);
}

context.strokeStyle = "black";
context.stroke();
}

drawBoard();





var dragSrcEl = null;
//image
doms = document.getElementsByClassName("2b2");

for(i = 0; i < doms.length; i++){
	doms[i].addEventListener('dragstart',function(e){
       dragSrcEl = this;

       console.log(this)
	});

}


var con = document.getElementById("grid-render");
con.addEventListener('dragover',function(e){
    e.preventDefault(); // !!important
});
//insert image to stage
con.addEventListener('drop',function(e){

    var image = new Kinetic.Image({
       draggable : true
    });
    imageObj = new Image();
    imageObj.src = dragSrcEl.src;
    imageObj.onload = function(){
    	x = Math.floor((mousePos.x-10)/50)*50+10
    	y = Math.floor((mousePos.y-10)/50)*50+10
        context.drawImage(imageObj, x, y)
        drawBoard();
        console.log(grid)
    };
 });



var mousePos 
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

con.addEventListener('drop', function(evt) {
        mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message)
      }, false);