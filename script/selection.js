var downMouse;
var upMouse;


function changeSelected(begin, end){
	begin.x = Math.floor(begin.x/box);
	begin.y = Math.floor(begin.y/box);
	end.x = Math.floor(end.x/box)+1;
	end.y = Math.floor(end.y/box)+1;

	selected.size.width = end.x - begin.x;
	selected.size.height = end.y - begin.y;

	selected.begin.x = begin.x + camera.begin.x;
	selected.begin.y = begin.y + camera.begin.y;

	console.log(selected);
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

$("#grid-render").mousedown(function(e){
	if(e.which === 3){ //rightclick
		downMouse = getMousePos(canvas,e);
 	}

});

$("#grid-render").mouseup(function(e){
	if(e.which === 3){
		upMouse = getMousePos(canvas,e);

		changeSelected(downMouse, upMouse);

		updateGridInterface();
	}
});

$("#grid-render").mouseout(function(e){
	resetSelected();
	updateGridInterface();
});