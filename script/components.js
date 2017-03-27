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

	this.print = function print(){
		console.log("type: "+type);
		console.log("label;: "+label);
		console.log("inputs: "+inputs);
		console.log("outputs: "+outputs);
		console.log("direction: "+direction);
		console.log("delay: "+delay);
		console.log("size, (w,h): ("+width+" ,"+height+")");
		console.log("location (x,y): "+x+" ,"+y+")");
	}
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
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

	return temp;
}