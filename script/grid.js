var grid = []; //all components on grid

var p = 0; //padding

var box = 50 //size of each grid box = 50x50

var selected = {
  begin: {
    x: 0,
    y: 0
  },

  size: {
    width: 0,
    height: 0
  }
}


$(document).ready(function(){

});

function moveComponentRelatively(fromX, fromY, amountX, amountY){
  return moveComponent(fromX, fromY, fromX + amountX, fromY + amountY);
}

function moveComponent(fromX, fromY, toX, toY){
  var curr = deleteComponent(fromX, fromY);

  if(curr == null){
    return false;
  }

  curr.x = toX;
  curr.y = toY;

  if(canComponentBePlaced(curr)){
    grid.push(curr);
    return true;
  }
  else{
    //console.log("cannot be placed");
    curr.x = fromX;
    curr.y = fromY; 
    grid.push(curr);
    return false;
  }
}

function deleteComponent(x,y){
  for(var i=0;i<grid.length;i++){
    var curr = grid[i];
    if(curr.x == x && curr.y == y){
      return grid.splice(i,1)[0];
    }
  }

  return null;
}

function canComponentBeRotated(toRotate){
  for(var i=0;i<grid.length;i++){
    if(toRotate.x == grid[i].x && toRotate.y == grid[i].y){
      var gotten = grid.splice(i,1)[0];
      var tdir = gotten.direction;
      gotten.rotate();
      //console.log(gotten);
      var ret = canComponentBePlaced(gotten);

      //console.log(gotten);

      //console.log(ret);

      gotten.direction = tdir;
      grid.push(gotten);

      return ret;
    }
  }
}



function canComponentBePlaced(toPlace){
  for(var w=0;w<toPlace.locations().length;w++){
    var x = (toPlace.locations()[w]).x;
    var y = (toPlace.locations()[w]).y;


    for(var i=0;i<grid.length;i++){
      var curr = grid[i];
      var locations = curr.locations();


      for(var j=0;j<locations.length;j++){
        var cl = locations[j];
        if(x == cl.x && y == cl.y){
          return false;
        }
      }
    }
  } 

  return true;
}

function getAtGrid(x,y){
  for(var i=0;i<grid.length;i++){
    var curr = grid[i];
    var cl = curr.locations();

    //console.log(cl);

    for(var j=0;j<cl.length;j++){
      //console.log(j)
      if(cl[j].x == x && cl[j].y == y){
        return curr;
      }
    }
  }

  return null;
}

function getComponentByType(comp,x,y){
  var toPush;
  //gates
  if(comp === AND_GATE_COMPONENT){
    toPush = and_gate(null,x,y);
  }
  else if(comp === OR_GATE_COMPONENT){
    toPush = or_gate(null,x,y);
  }
  else if(comp === XOR_GATE_COMPONENT){
    toPush = xor_gate(null,x,y);
  }
  else if(comp === NOT_GATE_COMPONENT){
    toPush = not_gate(null,x,y);
  }

  //wires
  else if(comp === L_WIRE_COMPONENT){
    toPush = l_wire(null,x,y);
  }
  else if(comp === I_WIRE_COMPONENT){
    toPush = i_wire(null,x,y);
  }
  else if(comp === T_WIRE_COMPONENT){
    toPush = t_wire(null,x,y);
  }
  else if(comp === CROSS_WIRE_COMPONENT){
    toPush = cross_wire(null,x,y);
  }

  //boxes
  else if(comp === PRINT_BOX_COMPONENT){
    toPush = print_box(null,x,y);
  }
  else if(comp === ON_BOX_COMPONENT){
    toPush = on_box(null,x,y);
  }
  else if(comp === VAR_BOX_COMPONENT){
    toPush = var_box(null,x,y);
  }

  return toPush;
}

function addToGrid(comp){
  grid.push(comp);
}