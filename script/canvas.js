// JS file for rendering Grid interface

//Canvas attributes
var grid; //grid containing canvas
var canvas = document.getElementById("grid-render");; //canvas
var context; //canvas context
var cw; //Canvas width
var ch; //Canvas height

setCanvasSize();

//Camera attributes
var camera = {
  begin: {
    x: 0,
    y: 0
  },

  end: {
    x: Math.floor(cw/box) + 1,
    y: Math.floor(ch/box) + 1
  }
};

drawBoard();

$(document).keydown(function(e){
  switch(e.which) {
    case 37: 
      moveCamera(LEFT, 1);// left
      break;

    case 38: 
      moveCamera(UP, 1);// up
      break;

    case 39: 
      moveCamera(RIGHT, 1);// right
      break;

    case 40: 
      moveCamera(DOWN, 1);// down
      break;

    default: 
      return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(window).on("resize", function(){
  setCanvasSize();
  refreshCameraOnResize();
  updateGridInterface();
  console.log("redrew everything!!!")
});



function withinCameraView(x,y){
  return x >= camera.begin.x && x <= camera.end.x && y >= camera.begin.y && y <= camera.end.y;
}

function getCameraLocation(x,y){
  var nx = x - camera.begin.x;
  var ny = y - camera.begin.y;

  var cx = nx * box;
  var cy = nx * box;

  return {x: cx, y: cy};
}

function moveCamera(direction, amount){
  if((direction == LEFT && camera.begin.x == 0) || (direction == UP && camera.begin.y == 0)) {
    console.log("LEFT OR UP DIRECTION: Cannot move camera into negative coordinate");
  }
  else{
    switch(direction){
      case UP: 
        camera.begin.y -= amount;
        camera.end.y -= amount;
        break;

      case DOWN: 
        camera.begin.y += amount;
        camera.end.y += amount;
        break;

      case LEFT:
        camera.begin.x -= amount;
        camera.end.x -= amount;
        break;

      case RIGHT:
        camera.begin.x += amount;
        camera.end.x += amount;
        break;

      default: 
        console.log("Failed to move camera, no direction!");
        break;
    }

    updateGridInterface();

    console.log(camera)
  }
}

function refreshCameraOnResize(){

    var ex = Math.floor(cw/box) + 1;
    var ey = Math.floor(ch/box) + 1;

    camera.end.x = camera.begin.x + ex;
    camera.end.y = camera.begin.y + ey;
}

function setCanvasSize(){
  gridWindow = document.getElementsByClassName("grid")[0];

  canvas.width = gridWindow.offsetWidth;
  canvas.height = gridWindow.offsetHeight;

  context = canvas.getContext("2d");

  cw = canvas.width;
  ch = canvas.height;
}

function drawNumbers(){
  context.clearText

  context.font="10px Georgia";

  for(var x = camera.begin.x; x <= camera.end.x; x++) {
    context.fillText(""+x, box * (x - camera.begin.x) + (box/2), box/5);
  }

  for(var y = camera.begin.y; y <= camera.end.y; y++) {
    context.fillText(""+y, box/5, box * (y - camera.begin.y) + (box/2));
  }
}

function drawBoard(){
  drawNumbers();

  for(var x = 0; x <= cw; x += 50) {
      context.moveTo(0.5 + x + p, p);
      context.lineTo(0.5 + x + p, ch + p);
  }

  for(var y = 0; y <= ch; y += 50) {
      context.moveTo(p, 0.5 + y + p);
      context.lineTo(cw + p, 0.5 + y + p);
  }

  context.strokeStyle = "black";
  context.stroke();
}

function drawOnCanvas(x, y, image){
  context.drawImage(image, x, y);
}

function drawComponents(){
  for(var i=0; i<grid.length; i++){
    var curr = grid[i];

    if(withinCameraView(curr.x, curr.y)){
      var imgDraw = getImageByComponentType(curr.type);
      drawOnCanvas((curr.x - camera.begin.x) * box, (curr.y - camera.begin.y) * box, imgDraw);
      console.log(imgDraw);
    }
  }
}

function updateGridInterface(){
  context.clearRect(0,0, cw, ch);
  drawBoard();
  drawComponents();
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
    
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function calculateGridXY(x,y){
  return{
    x: camera.begin.x + Math.floor(x/50),
    y: camera.begin.y + Math.floor(y/50)
  };
}


var dragSrcEl = null;
//image
doms = document.getElementsByClassName("c-icon");

for(i = 0; i < doms.length; i++){
  doms[i].addEventListener('dragstart',function(e){
    dragSrcEl = this;
    e.dataTransfer.setDragImage(getImageByComponentType(this.id),0,0);
  });
}

canvas.addEventListener('dragover',function(e){
    e.preventDefault(); // !!important
});


canvas.addEventListener('drop',function(e){

  var mp = getMousePos(canvas,e);
  var gridPos = calculateGridXY(mp.x,mp.y);

  console.log("gridPos!!!!");
  console.log(gridPos)

  if(!doesComponentExist(gridPos.x,gridPos.y)){
    console.log(grid);
    addToGrid(dragSrcEl.id, gridPos.x, gridPos.y);
    updateGridInterface();
  }

});
