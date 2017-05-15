var downMouse;
var upMouse;


function selectedSameSquare(){
	return selected.size.width == 1 && selected.size.height == 1;
}

function changeSelected(begin, end){

	selected.size.width = end.x - begin.x+1;
	selected.size.height = end.y - begin.y+1;

	selected.begin.x = begin.x + camera.begin.x;
	selected.begin.y = begin.y + camera.begin.y;
	selected.count = 0
	//console.log(selected.size.width+" "+selected.size.height);
}

function resetSelected(){
	selected.begin.x = 0;
	selected.begin.y = 0;
	selected.size.width = 0;
	selected.size.height = 0;
}

//Gets rid of tooltip(context menu on right click)
canvas.addEventListener("contextmenu", function(e){
	e.preventDefault();
	return false;
}, false);

massSelection = []

$("#grid-render").mousedown(function(e){
	if(e.which === 3){ //rightclick
		downMouse = calculateGridXY(canvas,e);

 	}
 	if(e.which === 1){ //leftclick
 		closeAttributeEditor();
 		if((selected.size.width < 1 && selected.size.height < 1) || selectedSameSquare()){ //nothing selected
 			//closeAttributeEditor();
 			downMouse = calculateGridXY(canvas, e);
 		}
 		else{
 			downMouse = calculateGridXY(canvas, e);
 			massSelection = findAllSelected();
 		}
 	}

});

/*
 * This handles moving components on the screen
 */
$("#grid-render").mouseup(function(e){

	if(e.which === 3){ //rightclick

		// get the mouse up grid coordinates
		upMouse = calculateGridXY(canvas,e);

		// changes the selected region
		changeSelected(downMouse, upMouse);
		
		
		// trim  the region too
		trimSelection();
		

		if(upMouse.x == downMouse.x && upMouse.y == downMouse.y){
			if(findAllSelected().length == 0){	
				console.log(findAllSelected())
				selected.begin.x = upMouse.x
				selected.begin.y = upMouse.y
				selected.size.width = 1
				selected.size.height = 1
				massSelection = []
			} else{
				var pos = $(".grid").offset();
				openAttributeEditor(selected.begin.x, selected.begin.y, upMouse.x * box+box/2 + pos.left, upMouse.y * box+box/2 +pos.top);
			}
		}

	}
	if(e.which === 1){ //leftclick
		if((selected.size.width < 1 && selected.size.height < 1)){ //nothing selected
			closeAttributeEditor();
			upMouse = calculateGridXY(canvas, e);			
			

			if(getAtGrid(downMouse.x, downMouse.y) == null)
				printPath(downMouse, upMouse)

			if(downMouse.x === upMouse.x && downMouse.y === upMouse.y){//upMouse and downMouse are on the same square

				resetSelected()
				massSelection = []
				updateGridInterface();
				//trigger onclick function of component
				var currSelectedComponent = getAtGrid(downMouse.x, downMouse.y);
				if(currSelectedComponent != null){
					currSelectedComponent.onclick();
				}
			}
			else{
				moveComponent(downMouse.x, downMouse.y, upMouse.x, upMouse.y);
			}

 		}
 		else{
			upMouse = calculateGridXY(canvas, e);

 			if((massSelection.length == 0) || ((upMouse.x == downMouse.x) && (upMouse.y == downMouse.y))){
 				
 				//console.log("failed")
 				//console.log((selected.begin.x - massSelection[0].x) + " " + (selected.begin.y - massSelection[0].y))
 			} else if(downMouse.x >= selected.begin.x && downMouse.y >= selected.begin.y 
 				&& downMouse.x < selected.begin.x + selected.size.width 
 					&& downMouse.y < selected.begin.y + selected.size.height){ 				
				updateUndoList()


				newx  = upMouse.x - (downMouse.x - selected.begin.x)
				newy = upMouse.y - (downMouse.y - selected.begin.y)

				console.log("mass movement")

				var newSelected = {
				  begin: {
				    x: newx,
				    y: newy
				  },

				  size: {
				    width: selected.size.width,
				    height: selected.size.height
				  }
				}

				newSelection = findAllSelected(newSelected)

				
				// loops to see if everything can be moved
				for(var i = 0; i < massSelection.length; i++){
					if(newSelection.indexOf(massSelection[i]) != -1){
						newSelection.splice(newSelection.indexOf(massSelection[i]), 1)
					}

				
				}
				if(newSelection.length != 0){
					console.log("new region not empty")
					return false;
				}
				
				// if it makes it out of the loop everything selected can be moved

				for(var i = 0; i < massSelection.length; i++){
					// should get distance from origin x/y and orgin x y
					// y2-y1, x2-x1
					x1 = massSelection[i].x
					y1 = massSelection[i].y
					x2 = selected.begin.x
					y2 = selected.begin.y



					newx = upMouse.x - (downMouse.x - x2) + (x1-x2)
					newy = upMouse.y - (downMouse.y - y2) + (y1-y2)

					massSelection[i].x = newx;
					massSelection[i].y = newy;

					//moveComponent(x1, y1, newx, newy);
					//undoList.pop()
				}

				selected.begin.x = upMouse.x - (downMouse.x - selected.begin.x)
				selected.begin.y = upMouse.y - (downMouse.y - selected.begin.y)

				massSelection = []
 			}

 		}

	}

	updateGridInterface();
});

$("#grid-render").mouseout(function(e){
	//resetSelected();
});

$("#grid-render").keypress(function(e){
	console.log(e.which);
	if(e.which == 'r'){

	}
});