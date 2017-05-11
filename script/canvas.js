// JS file for rendering Grid interface

var p = 0; //padding
var box = 50 //size of each grid box = 50x50

//Canvas attributes
var gridWindow; //grid containing canvas
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


function withinCameraView(x,y){
  var curr = getAtGrid(x,y);
  var cl = curr.locations();

  for(var i=0;i<cl.length;i++){
    var x = cl[i].x;
    var y = cl[i].y;

    if(x >= camera.begin.x && x <= camera.end.x && y >= camera.begin.y && y <= camera.end.y){
      return true;
    }
  }

  return false;
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

    //console.log(camera)
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

function drawOnCanvas(x, y, image, direction){
  //context.drawImage(image, x, y);
  context.save();

  context.translate(x, y);
  
  context.rotate(directionToRadian(direction));
  // draw it up and to the left by half the width
  // and height of the image 
  //context.drawImage(image, x, y);
  switch(direction){
    case UP:
      context.drawImage(image, 0, 0);
      break;
    case RIGHT:
      context.drawImage(image, 0, -image.height);
      break;
    case DOWN:
      context.drawImage(image, -image.width, -image.height);
      break;
    case LEFT:
      context.drawImage(image, -image.width, 0);
      break;
    default:
      console.log("Error no direction, cannot draw FUNCTION: drawOnCanvas(x,y,image,direction)");

  }

  // and restore the co-ords to how they were when we began
  context.restore(); 


}

function directionToRadian(direction){
  var degree;
  if(direction == UP){
    degree = 0;
  }
  else if(direction == RIGHT){
     degree = 90
  }
  else if(direction == DOWN){
    degree = 180
  }
  else if(direction == LEFT){
    degree = 270
  }
  return degree * Math.PI / 180;
}

function rotateCoords(x, y, width, height, direction){
  var cw = width;
  var ch = height;
  cx = y;
  cy = x

  switch(direction){
     case RIGHT: //90
          cw = height;
          ch = width;
          cy = y + (height * (-1));
          break;
     case DOWN: //180
          cx = width * (-1);
          cy = y + (height * (-1));
          break;
     case LEFT: //270
          cw = height;
          ch = width;
          cx = x + (width * (-1));
          break;
  }

  return {
    x: cx,
    y: cy,
    width: cw,
    height: ch
  };
}

function drawPsuedoComponents(component){
  for (var i = component.psuedoComponent.length - 1; i >= 0; i--) {
    var curr = component.psuedoComponent[i];

    var imgDraw = getImageByComponentType(curr);      
    drawOnCanvas((curr.x - camera.begin.x) * box, (curr.y - camera.begin.y) * box, imgDraw, curr.direction);
  }
}

function drawComponents(){
  for(var i=0; i<grid.length; i++){
    var curr = grid[i];

    if(withinCameraView(curr.x, curr.y)){
      if(curr.psuedoComponent != null){
        drawPsuedoComponents(curr);
      }
      else{
        var imgDraw = getImageByComponentType(curr);      
        drawOnCanvas((curr.x - camera.begin.x) * box, (curr.y - camera.begin.y) * box, imgDraw, curr.direction);
      }
    }
  }
}

function drawSelected(){
  if(selected.size.width > 0 && selected.size.height > 0){
    context.globalAlpha = 0.2;
    context.fillStyle = "yellow";
    context.fillRect((selected.begin.x - camera.begin.x) * box, (selected.begin.y - camera.begin.y) * box, selected.size.width * box, selected.size.height * box);
    context.globalAlpha = 1.0;
    context.fillStyle =  "black";
  }
}

function updateGridInterface(){
  // maybe

  context.clearRect(0,0, cw, ch);
  drawBoard();
  drawComponents();
  drawSelected();
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



// Drag and drop functionality
  var dragSrcEl = null;
  //image
  doms = document.getElementsByClassName("c-icon");

  for(i = 0; i < doms.length; i++){
    doms[i].addEventListener('dragstart',function(e){
      dragSrcEl = this;
      var compType = getComponentByType(this.id);
      e.dataTransfer.setDragImage(getImageByComponentType(compType), box/2, box/2);
    });
  }

  canvas.addEventListener('dragover',function(e){
      e.preventDefault(); // !!important
  });


  canvas.addEventListener('drop',function(e){

    var mp = getMousePos(canvas,e);
    var gridPos = calculateGridXY(mp.x,mp.y);

    var toPlace = getComponentByType(dragSrcEl.id, gridPos.x, gridPos.y);

    if(canComponentBePlaced(toPlace)){
      addToGrid(toPlace);
      updateGridInterface();
    }

  });

// Camera movement
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

// resize grid on window resize
$(window).on("resize", function(){
  setCanvasSize();
  refreshCameraOnResize();
  updateGridInterface();
});
