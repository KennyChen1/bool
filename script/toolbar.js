/* functionality for toolbar div*/

$(".toolbar #run").click(function(e){
	e.preventDefault();
	evaluate();
	updateGridInterface();
});


var clipboard = [];

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
    if(clipboardtemp[i].width == 2){
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

function pasteToWorkspace(){
  // nothing in the clipboard, don't do anything

  clipboardCopy = jQuery.extend(true, {}, clipboard);


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
    // if it gets here it is assummed that all the things 
    // to be pasted can be placed on to the board
    for(i = 0; i < Object.keys(clipboardCopy).length; i++){
      grid.push(clipboardCopy[i])
    }

  }

}

undoList = [];
fucntion updateUndoList(){
  undoList.push(grid);
}