var grid = []; //all components on grid

var p = 0; //padding

var box = 50 //size of each grid box = 50x50





$(document).ready(function(){

  /*

    grid.push(and_gate("first", 10,10,100,100));
    grid.push(and_gate("second", 10,10,100,100));
    grid.push(and_gate("third", 10,10,100,100));
    grid.push(and_gate("fourth", 10,10,100,100));

    for(var i=0;i<grid.length;i++){
      console.log(grid[i].print);
      console.log(grid[i].type);

      $(".workspace .grid").append("<span>"+grid[i].label+"</span>");
    }

    */



});

$( function() {
    $( "#draggable" ).draggable({ helper: "original" });
    $( "#draggable2" ).draggable({ opacity: 0.7, helper: "clone" });
    $( "#draggable3" ).draggable({
      cursor: "move",
      cursorAt: { top: -12, left: -20 },
      helper: function( event ) {
        return $( "<div class='ui-widget-header'>I'm a custom helper</div>" );
      }
    });
    $( "#set div" ).draggable({ stack: "#set div" });
  } );


function addToGrid(comp,x,y){
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

  grid.push(toPush);
}

function getImageByComponentType(comp){
  var path = "img/c-icon/";
  if(comp === AND_GATE_COMPONENT){
    path = path + "and.png";
  }
  else if(comp === OR_GATE_COMPONENT){
    path = path + "or.png";  }
  else if(comp === XOR_GATE_COMPONENT){
    path = path + "xor.png";  }
  else if(comp === NOT_GATE_COMPONENT){
    path = path + "not.png";
  }

  //wires
  else if(comp === L_WIRE_COMPONENT){
    path = path + "l.png";
  }
  else if(comp === I_WIRE_COMPONENT){
    path = path + "minus.png";  
  }
  else if(comp === T_WIRE_COMPONENT){
    path = path + "t.png";  
  }
  else if(comp === CROSS_WIRE_COMPONENT){
    path = path + "cross.png";
  }

  //boxes
  else if(comp === PRINT_BOX_COMPONENT){
    path = path + "print.png";
  }
  else if(comp === ON_BOX_COMPONENT){
    path = path + "on.png";
  }
  else if(comp === VAR_BOX_COMPONENT){
    path = path + "var.png";
  }

  return path;
}
