// Logic Gates
var AND_GATE_COMPONENT = "AND"; 
var OR_GATE_COMPONENT = "OR";
var XOR_GATE_COMPONENT = "XOR";
var NOT_GATE_COMPONENT = "NOT";

// Circuit Passthroughs/Wires
var L_WIRE_COMPONENT = "L"; 			// L
var I_WIRE_COMPONENT = "I"; 			// |
var T_WIRE_COMPONENT = "T"; 			// T
var CROSS_WIRE_COMPONENT = "CROSS"; 	// +

// Blackboxes
var PRINT_BOX_COMPONENT = "PRINT";
var ON_BOX_COMPONENT = "ON";
var VAR_BOX_COMPONENT = "VAR";

//directions
var UP = 1;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 4;

function component(
		type, 
		label, 
		inputs, 
		outputs, 
		direction, 
		delay, 
		width, 
		height, 
		x, 
		y,
		message
	){
	this.type = type;
	this.label = label; //modifiable attribute
	this.inputs = inputs;
	this.outputs = outputs;

	this.direction = direction; //modifiable attribute

	//modifiable attribute
	this.delay = delay;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
}

function and_gate(label, width, height, x, y){
	var temp = new component(
		AND_GATE_COMPONENT, //type
		label, 				//label
		2, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function or_gate(label, width, height, x, y){
	var temp = new component(
		OR_GATE_COMPONENT, //type
		label, 				//label
		2, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function xor_gate(label, width, height, x, y){
	var temp = new component(
		XOR_GATE_COMPONENT, //type
		label, 				//label
		2, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function not_gate(label, width, height, x, y){
	var temp = new component(
		NOT_GATE_COMPONENT, //type
		label, 				//label
		1, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function not_gate(label, width, height, x, y){
	var temp = new component(
		NOT_GATE_COMPONENT, //type
		label, 				//label
		1, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function l_wire(label, width, height, x, y){
	var temp = new component(
		L_WIRE_COMPONENT,	//type
		label, 				//label
		1, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function i_wire(label, width, height, x, y){
	var temp = new component(
		I_WIRE_COMPONENT,	//type
		label, 				//label
		1, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function t_wire(label, width, height, x, y){
	var temp = new component(
		T_WIRE_COMPONENT,	//type
		label, 				//label
		1, 					//inputs
		2, 					//outputs
		UP,					//direction
		0, 					//delay
		width, 				//width
		height, 			//height
		x, 					//x
		y,					//y
		null				//print message
	);
}

function cross_wire(label, width, height, x, y){
	var temp = new component(
		CROSS_WIRE_COMPONENT,	//type
		label, 					//label
		1, 						//inputs
		3, 						//outputs
		UP,						//direction
		0, 						//delay
		width, 					//width
		height, 				//height
		x, 						//x
		y,						//y
		null					//print message
	);
}

function print_box(label, width, height, x, y, message){
	var temp = new component(
		PRINT_BOX_COMPONENT,	//type
		label, 					//label
		1, 						//inputs
		1, 						//outputs
		UP,						//direction
		0, 						//delay
		width, 					//width
		height, 				//height
		x, 						//x
		y,						//y
		message					//print message
	);
}

function on_box(label, width, height, x, y){
	var temp = new component(
		ON_BOX_COMPONENT,		//type
		label, 					//label
		0, 						//inputs
		4, 						//outputs
		UP,						//direction
		0, 						//delay
		width, 					//width
		height, 				//height
		x, 						//x
		y,						//y
		null					//print message
	);
}

function var_box(label, width, height, x, y){
	var temp = new component(
		VAR_BOX_COMPONENT,		//type
		label, 					//label
		0, 						//inputs
		4, 						//outputs
		UP,						//direction
		0, 						//delay
		width, 					//width
		height, 				//height
		x, 						//x
		y,						//y
		null					//print message
	);
}