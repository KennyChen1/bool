$(document).ready(function(){
});

/*
 * Checks if all the components in selectedGrid Array can be rotated
 * true if yes
 * false otherwise
 */
function canAllBeRotate(selectedGrid){
  for(i = 0; i < selectedGrid.length; i++){
    if(canComponentBeRotated(selectedGrid[i]) == false){
      return false;
    }
  }
  return true;
}

/*
* truncated the selected grid to the smallest shit grid it can fit into
*/
function condenseSelected(selectedgrid){
  if(selectedgrid.length == 0){
    return false;
  } else{
    minx = selected.begin.x + selected.size.width;
    miny = selected.begin.y + selected.size.height;

    maxy = selected.begin.y;
    maxx = selected.begin.x;
    
    // finds the max
    for(i = 0; i < selectedgrid.length; i++){
      if(selectedgrid[i].width == 2){
        if(selectedgrid[i].locations()[1].x > maxx)
          maxx = selectedgrid[i].locations()[1].x
        if(selectedgrid[i].locations()[1].y > maxy)
          maxy = selectedgrid[i].locations()[1].y      
      }
    }

    // finds the min
    for(i = 0; i < selectedgrid.length; i++){
      if(selectedgrid[i].width == 2){
        if(selectedgrid[i].locations()[0].x < minx)
          minx = selectedgrid[i].locations()[0].x
        if(selectedgrid[i].locations()[0].y < miny)
          miny = selectedgrid[i].locations()[0].y      
      }
    }
    selected.begin.x = minx
    selected.begin.y = miny
    selected.size.width = maxx - selected.begin.x + 1
    selected.size.height = maxy - selected.begin.y + 1

    return true;
  }
}

/*
 * returns all the components that are found within the selected region
 */
function findAllSelected(gridlist){
  var returnFound = []

  for(i = 0; i < grid.length; i++){
    if((grid[i].x >= selected.begin.x && grid[i].x < selected.begin.x + selected.size.width)
      && (grid[i].y >= selected.begin.y && grid[i].y < selected.begin.y + selected.size.height)){
      returnFound.push(grid[i]);
    } else if(grid[i].width == 2){
    if((grid[i].locations()[1].x >= selected.begin.x && grid[i].locations()[1].x< selected.begin.x + selected.size.width)
      && (grid[i].locations()[1].y >= selected.begin.y && grid[i].locations()[1].y < selected.begin.y + selected.size.height)){
      returnFound.push(grid[i]);
      }
    }
  } // end of for loop

  return returnFound;
}

/*
 * takes all the selected compointents and rotates them all indivually
 */
function rotateSelected(){
  var selectedComps = findAllSelected();

  if(selectedComps.length == 0)
    return;

  if(canAllBeRotate(selectedComps) == false){ 
    // there exists a component that cannot be rotated
    // probably should be placed into debug menu
    return;
  }

  updateUndoList();
  
  // preserve the box
  maxx = 0
  maxy = 0;

  //rotates everything
  for(i = 0; i < selectedComps.length; i++){
    selectedComps[i].direction = (selectedComps[i].direction+1)%4
  }

  for(i = 0; i < selectedComps.length; i++){
    if(selectedComps[i].width == 2){
      if(selectedComps[i].locations()[1].x > maxx)
        maxx = selectedComps[i].locations()[1].x
      if(selectedComps[i].locations()[1].y > maxy)
        maxy = selectedComps[i].locations()[1].y      
    } else if(selectedComps[i].width == 1){ 
    // width is 1 does the same thing as the width == 2 but little different
      if(selectedComps[i].locations()[0].x > maxx)
        maxx = selectedComps[i].locations()[0].x
      if(selectedComps[i].locations()[0].y > maxy)
        maxy = selectedComps[i].locations()[0].y    
    } // end if of else
  } // end of for

  selected.size.width = maxx - selected.begin.x + 1
  selected.size.height = maxy - selected.begin.y + 1

  updateGridInterface()  

}

/*
 * Rotates all the components preserving the order
 */
function rotateAxis(){
  var selectedComps = findAllSelected();

  if(selectedComps.length == 0)
    return;

  var tempswitch = selected.size.width;
  selected.size.width = selected.size.height;
  selected.size.height = tempswitch;

  updateUndoList();

  for(i = 0; i < selectedComps.length; i++){
    var distx = selectedComps[i].x - selected.begin.x
    var disty = selectedComps[i].y - selected.begin.y
    if(selectedComps[i].width == 2 
      && (selectedComps[i].direction == 1 || selectedComps[i].direction == 3)){
      selectedComps[i].x = selected.begin.x + selected.size.width - disty - 2;
    } else {
      selectedComps[i].x = selected.begin.x + selected.size.width - disty - 1;
    }
    selectedComps[i].y = selected.begin.y + distx;
    selectedComps[i].direction = (selectedComps[i].direction+1)%4
  }

  updateGridInterface()
}


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

   // component can be moved
  if(canComponentBePlaced(curr)){
    grid.push(curr);
    updateUndoList();
    return true;
  }
  else{ // component cannot be moved
    console.log("cant be moved")
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

/*
 * Checks if the component toRotate can be rotated
 * returns true if it can
 * false otherwise
 */
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
  updateUndoList();
  grid.push(comp);
}