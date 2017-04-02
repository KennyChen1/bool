var attributeEditor = $(".attribute-editor")

var currentGridComponent;


function openAttributeEditor(x,y, screenX, screenY){
	var curr = getAtGrid(x,y);
	//console.log(curr);

	if(curr != null){
		//console.log("openedattributeeditor");
		var details = curr.type+" @ ("+curr.x+","+curr.y+") | direction: "+directionToString(curr.direction);
		var delay = ""+curr.delay;
		var message = "";
		var label = "";
		if(curr.message != null){
			message = message+curr.message;
		}
		if(curr.label != null){
			label = label+curr.label;
		}

		//var screenX = currMouseScreen.x;
		//var screenY = currMouseScreen.y;
		var bodySizeX = $("body").outerWidth(true);
		var bodySizeY = $("body").outerHeight(true);

		var renderPosX;
		var renderPosY;

		var aeWidth = attributeEditor.outerWidth();
		var aeHeight = attributeEditor.outerHeight();

		if(screenX < bodySizeX/2){
			//render forward
			renderPosX = screenX;
		}
		else{
			//render backward
			renderPosX = screenX - aeWidth;
		}
		if(screenY < bodySizeY/2){
			//render bottom	
			renderPosY = screenY;
		}
		else{
			//render top
			renderPosY = screenY - aeHeight;
		}

		$(".attribute-editor #ae-details").text(details);
		$(".attribute-editor #ae-delay-text").val(delay);
		$(".attribute-editor #ae-message-text").val(message);
		$(".attribute-editor #ae-label-text").val(label);

		attributeEditor.addClass("show");
		attributeEditor.offset({top: renderPosY, left: renderPosX});

		currentGridComponent = curr;
	}
}

function closeAttributeEditor(){
	attributeEditor.removeClass("show");
}

function saveAttributes(){
	var tdelay = $(".attribute-editor #ae-delay-text").val();
	var tmessage = $(".attribute-editor #ae-message-text").val();
	var tlabel = $(".attribute-editor #ae-label-text").val();

	if(tdelay != null){
		currentGridComponent.delay = parseInt(tdelay,10);
	}
	if(tmessage != null){
		currentGridComponent.message = tmessage;
	}
	if(tlabel != null){
		currentGridComponent.label = tlabel;
	}
}

$(".attribute-editor #save").mousedown(function(e){
	saveAttributes();
	closeAttributeEditor();
});

$(".attribute-editor #delete").mousedown(function(e){
	deleteComponent(currentGridComponent.x, currentGridComponent.y);
	closeAttributeEditor();
	updateGridInterface();
});

$(".attribute-editor #rotate").mousedown(function(e){
	if(canComponentBeRotated(currentGridComponent)){
		currentGridComponent.rotate();
		closeAttributeEditor();
		updateGridInterface();
	}
});

$(document).mousedown(function(e){
	if(e.which === 3){
		closeAttributeEditor();
	}
});