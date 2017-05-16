var attributeEditor = $(".attribute-editor");

// the variable that is selected to the attribute editor
var currentGridComponent;

/* Opens the attribute editor for editing components 
 *	parameters 
 *		x - the x coordinates of the grid
 *		y - the y coordinates of the grid
 *		screenx - the offset of the click
 *		screeny - the offset of the click
 *	returns nothing
 */
function openAttributeEditor(x,y, screenX, screenY){
	var curr = getAtGrid(x,y);

	if(curr != null){
		var details = curr.type+" @ ("+curr.x+","+curr.y+")"
		var delay = ""+curr.delay;
		var message = "";
		var label = "";
		if(curr.message != null){
			message = message+curr.message;
		}
		if(curr.label != null){
			label = label+curr.label;
		}

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

/* Closes the attribute editor 
 * 		precondition - the attribute editor must be open already *
 */
function closeAttributeEditor(){
	attributeEditor.removeClass("show");
}

/* Apply the changes the component attributes base on the text fields
 * 		precondition - the attribute editor must be open already 
 */
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


/* The event handler to disable opening the context menu on the attribute editor
 */
$(".attribute-editor").contextmenu(function(){
	return false;
});

/* The event handler to apply the selected component changes
 * 		preconditions - the attribute editor must be open
 */
$(".attribute-editor #save").click(function(e){
	saveAttributes();
	closeAttributeEditor();
});

/* The event handler to delete the selected component from the grid
 * 		preconditions - the attribute editor must be open
 */
$(".attribute-editor #delete").click(function(e){
	deleteComponent(currentGridComponent.x, currentGridComponent.y);
	closeAttributeEditor();
	updateGridInterface();
});

/* The event handler to rotate clockwise the selected component
 * 		preconditions - the attribute editor must be open
 */
$(".attribute-editor #rotate").click(function(e){
	if(canComponentBeRotated(currentGridComponent)){
		rotateSelected();
		updateGridInterface();
	}
});

/* The event handler to flip the selected component
 * 		preconditions - the attribute editor must be open
 */
$(".attribute-editor #flip").click(function(e){
	currentGridComponent.flipped = !currentGridComponent.flipped;
	updateGridInterface();
});

/* The event handler to close the attribute editor
 */
$(document).mousedown(function(e){
	if(e.which === 3){
		closeAttributeEditor();
	}
});