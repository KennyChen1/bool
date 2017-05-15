/* functionality for toolbar div*/

$(".toolbar #run").click(function(e){
	e.preventDefault();
	evaluate();
	updateGridInterface();
});


$(document).on("keydown", function(e){
    if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)){
       copyToClipBoard()
    } else if (e.keyCode == 86 && (e.ctrlKey || e.metaKey)){
       pasteToWorkspace()
    } else if (e.keyCode == 88 && (e.ctrlKey || e.metaKey)){
       cut()
    } else if (e.keyCode == 89 && (e.ctrlKey || e.metaKey)){
       redo()
    } else if (e.keyCode == 90 && (e.ctrlKey || e.metaKey)){
       undo()
    } else if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)){
       writetofile()
    } else if (e.keyCode == 65 && (e.ctrlKey || e.metaKey)){
       selected.begin.x = 0
       selected.begin.y = 0
       selected.size.height = 1000
       selected.size.width = 1000
       e.preventDefault();
       updateGridInterface();
       trimSelection();


    }

});



// takes the shit places it into the clipboard
function copyToClipBoard(){
  // clear the clipboard
  clipboard = [];
  //var clipboard = findAllSelected(grid.slice());

  // finds all the thing within a region and makes a copy
	clipboardtemp = findAllSelected();

  // translate it to 0,0
	if(clipboardtemp.length == 0)
		return false;

  minx = selected.begin.x + selected.size.width + 3;
  miny = selected.begin.y + selected.size.height + 3;

    // finds the min
  for(i = 0; i < clipboardtemp.length; i++){
    if(clipboardtemp[i].width > 0){
      if(clipboardtemp[i].locations()[0].x < minx)
        minx = clipboardtemp[i].locations()[0].x
      if(clipboardtemp[i].locations()[0].y < miny)
        miny = clipboardtemp[i].locations()[0].y      
    }
  }

  for(i = 0; i < clipboardtemp.length; i++){
    // have to figure out how to deep clone
      tempx = copy(clipboardtemp[i])
    

  	tempx.x -= minx
  	tempx.y -= miny
    clipboard.push(tempx);
  }
  console.log("copied to clipboard")
  return true;

}

function copy(component){

    var x = component
    var y = x.type
    var tempx;
    switch(y){
      case "AND":
        tempx = new and_gate(x.label, x.x, x.y);
      break;

      case "XOR":
        tempx = new xor_gate(x.label, x.x, x.y);
      break;

      case "OR":
        tempx = new or_gate(x.label, x.x, x.y);
      break;

      case "NOT":
        tempx = new not_gate(x.label, x.x, x.y);
      break;

      case "BUFFER":
        tempx = new buffer_gate(x.label, x.x, x.y);
      break;

      case "CROSS":
        tempx = new cross_wire(x.label, x.x, x.y);
      break;

      case "I":
        tempx = new i_wire(x.label, x.x, x.y);
      break;

      case "T":
        tempx = new t_wire(x.label, x.x, x.y);
      break;

      case "L":
        tempx = new l_wire(x.label, x.x, x.y);
      break;

      case "CROSSING":
        tempx = new crossing_wire(x.label, x.x, x.y);
      break;

      case "SWITCH":
        tempx = new switch_box(x.label, x.x, x.y);
      break;

      case "PRINT":
        tempx = new print_box(x.label, x.x, x.y);
      break;

      case "LIGHT":
        tempx = new light_box(x.label, x.x, x.y);
      break;

      case EQ_BOX_COMPONENT:
        tempx = new eq_box(x.label, x.x, x.y);
      break;

      default:
        console.log("Circuit type incorrect!");

    }

    tempx.direction = x.direction
    tempx.delay = x.delay
    tempx.message = x.message
    tempx.flipped = x.flipped

  return tempx;
}

// Deletes all components from the workspace that are selected
function deleteSelected(){
	for(i = grid.length-1; i >= 0; i--){
	    if((grid[i].x >= selected.begin.x && grid[i].x < selected.begin.x + selected.size.width)
	      && (grid[i].y >= selected.begin.y && grid[i].y < selected.begin.y + selected.size.height)){
	          grid.splice(i, 1);
	    } else if(grid[i].width == 2){
	      if((grid[i].locations()[1].x >= selected.begin.x && grid[i].locations()[1].x< selected.begin.x + selected.size.width)
	        && (grid[i].locations()[1].y >= selected.begin.y && grid[i].locations()[1].y < selected.begin.y + selected.size.height)){
	          grid.splice(i, 1);
	        }// end of if
	      }// end else if
    }// end of for
    updateGridInterface()  
}

function cut(){
  if(copyToClipBoard() == false){
    return false
  } else{
     deleteSelected()
  }  
    updateGridInterface()  
}

function pasteToWorkspace(){
  // nothing in the clipboard, don't do anything

  //clipboardCopy = jQuery.extend(true, {}, clipboard);
  var clipboardCopy = []

  if(clipboard.length == 0){
    console.log("nothing to paste")
    return false;
  } else{
    for(i = 0; i < clipboard.length; i++){

      var pasteCopy = copy(clipboard[i])
      pasteCopy.x += selected.begin.x;
      pasteCopy.y += selected.begin.y;
      clipboardCopy.push(pasteCopy)
      if(canComponentBePlaced(pasteCopy) == false){
        console.log("failed to place pasted component at " + pasteCopy.x + " " + pasteCopy.y)
        return false;
      }
    }
    updateUndoList()
    // if it gets here it is assummed that all the things 
    // to be pasted can be placed on to the board
    for(i = 0; i < clipboardCopy.length; i++){
      grid.push(clipboardCopy[i])
      if(clipboardCopy[i].type == "CROSSING"){
        clipboardCopy[i].move(clipboardCopy[i].x, clipboardCopy[i].y)
      }
    }

      console.log("pasted successfully")
      updateGridInterface()  
  }

}

function updateUndoList(){
  var newUndoList = []
  for(i = 0; i < grid.length; i++){
    newUndoList.push(copy(grid[i]));
  }


  undoList.push(newUndoList); 

}

function undo(){
  if(undoList.length == 0){
    return false;
  } else{
    var lastAction = undoList.pop()
        var newGridList = []

        for(i = 0; i < grid.length; i++){
          newGridList.push(copy(grid[i]));
        }
        redoList.push(newGridList)
      
    
    grid = lastAction;

    updateGridInterface()  

  }
  return true;
}

function redo(){
  if(redoList.length == 0){
    return false;
  }
    var redoAction = redoList.pop()

    var undoGridCopy = []

    for(i = 0; i < grid.length; i++){
      undoGridCopy.push(jQuery.extend(true, {}, grid[i]));
    }

    undoList.push(undoGridCopy);

    grid = redoAction;

    updateGridInterface()  

    return true;
}