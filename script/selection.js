var downMouse;
var upMouse;

function selectedSameSquare(){
	return selected.size.width == 1 && selected.size.height == 1;
}

function changeSelected(begin, end){
	begin.x = Math.floor(begin.x/box);
	begin.y = Math.floor(begin.y/box);
	end.x = Math.floor(end.x/box)+1;
	end.y = Math.floor(end.y/box)+1;

	selected.size.width = end.x - begin.x;
	selected.size.height = end.y - begin.y;

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
		downMouse = getMousePos(canvas,e);
 	}
 	if(e.which === 1){ //leftclick
 		if((selected.size.width < 1 && selected.size.height < 1) || selectedSameSquare()){ //nothing selected
 			closeAttributeEditor();
 			downMouse = getMousePos(canvas, e);
 		}
 		else{
 			downMouse = getMousePos(canvas, e);
 			massSelection = findAllSelected(grid);
 		}
 	}

});

/*
 * This handles moving components on the screen
 */
$("#grid-render").mouseup(function(e){

	if(e.which === 3){ //rightclick
		upMouse = getMousePos(canvas,e);

		changeSelected(downMouse, upMouse);

		if(selectedSameSquare()){
			var pos = $(".grid").offset();
			openAttributeEditor(selected.begin.x, selected.begin.y, upMouse.x * box + pos.left, upMouse.y * box +pos.top);
		}
	}
	if(e.which === 1){ //leftclick
		if((selected.size.width < 1 && selected.size.height < 1) || selectedSameSquare()){ //nothing selected
			closeAttributeEditor();
			upMouse = getMousePos(canvas, e);

			var cdom = calculateGridXY(downMouse.x, downMouse.y);
			var cupm = calculateGridXY(upMouse.x, upMouse.y);

			moveComponent(cdom.x, cdom.y, cupm.x, cupm.y);

 		}
 		else{
 			if(massSelection.length == 0){
 				console.log(massSelection)
 			} else{
 				// maybe check if mouse up is in the selected region
 				upMouse = getMousePos(canvas, e);
				var cdom = calculateGridXY(downMouse.x, downMouse.y);
				var cupm = calculateGridXY(upMouse.x, upMouse.y);
				// needs to be fixed so it only works on drag 
				// also update the undoList less frequently
				// maybe also move it reletive rather than the top left
				for(var i = 0; i < massSelection.length; i++){
					x1 = massSelection[i].x
					y1 = massSelection[i].y
					x2 = selected.begin.x
					y2 = selected.begin.y

					moveComponent(x1, y1, cupm.x + (x1-x2), cupm.y + (y1-y2));
					undoList.pop()
				}
				updateUndoList()

				selected.begin.x = cupm.x - (cdom.x - selected.begin.x)
				selected.begin.y = cupm.y - (cdom.y - selected.begin.y)

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