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

function canComponentBePlaced(toPlace){

  for(var w=0;w<toPlace.locations().length;w++){
    var x = (toPlace.locations()[w]).x;
    var y = (toPlace.locations()[w]).y;

    console.log(toPlace);
    console.log(x);
    console.log(y);
    console.log(toPlace.locations());
    console.log(y);


    for(var i=0;i<grid.length;i++){
      var curr = grid[i];
      var locations = curr.locations();


      for(var j=0;j<locations.length;j++){
        var cl = locations[j];
        if(x == cl.x && y == cl.y){
          return true;
        }
      }
    }
  } 

  return false;
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