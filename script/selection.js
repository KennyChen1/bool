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
 				upMouse = getMousePos(canvas, e);
				var cdom = calculateGridXY(downMouse.x, downMouse.y);
				var cupm = calculateGridXY(upMouse.x, upMouse.y);
 			if((massSelection.length == 0) || ((cupm.x == cdom.x) && (cupm.y == cdom.y))){
 				console.log("failed")
 				console.log((selected.begin.x - massSelection[0].x) + " " + (selected.begin.y - massSelection[0].y))
 			} else{ 				
				updateUndoList()

				// loops to see if everything can be moved
				for(var i = 0; i < massSelection.length; i++){
					var x1 = massSelection[i].x
					var y1 = massSelection[i].y
					var x2 = selected.begin.x
					var y2 = selected.begin.y

					var newx = cupm.x - (cdom.x - x2) + (x1-x2)
					var newy = cupm.y - (cdom.y - y2) + (y1-y2)

					// makes a copy of the object, 
					// don't want to fuck with the orignal
					var temp = jQuery.extend(true, {}, massSelection[i])
					temp.x = newx;
					temp.y = newy;

					if(canComponentBePlaced(temp) == false){
						console.log("cannot be placed at: (" + newx + ", "+ newy + ")")
						massSelection = []
						return false;
					}
				}
				// if it makes it out of the loop everything selected can be moved

				for(var i = 0; i < massSelection.length; i++){
					// should get distance from origin x/y and orgin x y
					// y2-y1, x2-x1
					x1 = massSelection[i].x
					y1 = massSelection[i].y
					x2 = selected.begin.x
					y2 = selected.begin.y

					newx = cupm.x - (cdom.x - x2) + (x1-x2)
					newy = cupm.y - (cdom.y - y2) + (y1-y2)

					moveComponent(x1, y1, newx, newy);
					undoList.pop()
				}

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