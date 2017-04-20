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
       selected.begin.x = 0
       selected.size.height = 1000
       selected.size.width = 1000
       e.preventDefault();
       updateGridInterface();
    }

});



// takes the shit places it into the clipboard
function copyToClipBoard(){
  // clear the clipboard
  clipboard = [];
  //var clipboard = findAllSelected(grid.slice());

  // finds all the thing within a region and makes a copy
	var clipboardtemp = findAllSelected(grid);

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
    var tempx = jQuery.extend(true, {}, clipboardtemp[i])
  	tempx.x -= minx
  	tempx.y -= miny
    clipboard.push(tempx);
  }

  return true;

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

  var clipboardCopy = jQuery.extend(true, {}, clipboard);


  if(clipboardCopy.length == 0){
    return false;
  } else{
    for(i = 0; i < Object.keys(clipboardCopy).length; i++){
      clipboardCopy[i].x += selected.begin.x;
      clipboardCopy[i].y += selected.begin.y;
      if(canComponentBePlaced(clipboardCopy[i]) == false){
        return false;
      }
    }
    updateUndoList()
    // if it gets here it is assummed that all the things 
    // to be pasted can be placed on to the board
    for(i = 0; i < Object.keys(clipboardCopy).length; i++){
      grid.push(clipboardCopy[i])
    }

      updateGridInterface()  
  }

}

function updateUndoList(){
  var newUndoList = []
  for(i = 0; i < grid.length; i++){
    newUndoList.push(jQuery.extend(true, {}, grid[i]));
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
          newGridList.push(jQuery.extend(true, {}, grid[i]));
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