var path = "img/c-icon/";

// Logic Gates
var AND_IMAGE = loadImage(path + "and.png"); 
var OR_IMAGE = loadImage(path + "or.png");
var XOR_IMAGE = loadImage(path + "xor.png");
var NOT_IMAGE = loadImage(path + "not.png");

//var NAND_IMAGE = loadImage(path + "nand.png");
//var NOR_IMAGE = loadImage(path + "nor.png");

// Circuit Passthroughs/Wires
var L_IMAGE = loadImage(path + "l.png"); 		// L
var I_IMAGE = loadImage(path + "minus.png"); 	// |
var T_IMAGE = loadImage(path + "t.png"); 		// T
var CROSS_IMAGE = loadImage(path + "cross.png"); 	// +

// Blackboxes
var PRINT_IMAGE = loadImage(path + "print.png");
var ON_IMAGE = loadImage(path + "on.png");
var VAR_IMAGE = loadImage(path + "var.png");

function loadImage(path){
	var imageObj = new Image();
	imageObj.src = path;

	return imageObj;
}

function getImageByComponentType(comp){
	var image;
	if(comp === AND_GATE_COMPONENT){
		image = AND_IMAGE;
	}
	else if(comp === OR_GATE_COMPONENT){
		image = OR_IMAGE;  
	}
	else if(comp === XOR_GATE_COMPONENT){
		image = XOR_IMAGE;
	}
	else if(comp === NOT_GATE_COMPONENT){
		image = NOT_IMAGE;
	}

	//wires
	else if(comp === L_WIRE_COMPONENT){
		image = L_IMAGE;
	}
	else if(comp === I_WIRE_COMPONENT){
		image = I_IMAGE;
	}
	else if(comp === T_WIRE_COMPONENT){
		image = T_IMAGE; 
	}
	else if(comp === CROSS_WIRE_COMPONENT){
		image = CROSS_IMAGE;
	}

	//boxes
	else if(comp === PRINT_BOX_COMPONENT){
		image = PRINT_IMAGE;
	}
	else if(comp === ON_BOX_COMPONENT){
		image = ON_IMAGE;
	}
	else if(comp === VAR_BOX_COMPONENT){
		image = VAR_IMAGE;
	}

	return image;
}
