// Logic Gates
var AND_GATE_COMPONENT = "AND"; 
var OR_GATE_COMPONENT = "OR";
var XOR_GATE_COMPONENT = "XOR";
var NOT_GATE_COMPONENT = "NOT";

var NAND_GATE_COMPONENT = "NAND";
var NOR_GATE_COMPONENT = "NOR";

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

var grid = []; //all components on grid

function directionToString(direction){
	switch(direction){
		case UP:
			return "UP";
			break;
		case LEFT:
			return "LEFT";
			break;
		case RIGHT:
			return "RIGHT";
			break;
		case DOWN: 
			return "DOWN";
			break;

		default:
			console.log("none direction! FUNCTION: directionToString(direction)");
			return "???";
			break;
	}
}

function clockwise(direction){ //90 degree rotation
	switch(direction){
		case UP:
			return RIGHT;
			break;
		case RIGHT:
			return DOWN;
			break;
		case DOWN:
			return LEFT;
			break;
		case LEFT: 
			return UP;
			break;

		default:
			console.log("none direction! FUNCTION: clockwise(direction)");
			return "???";
			break;
	}
}

function counterClockwise(direction){ //270 degree rotation
	switch(direction){
		case UP:
			return LEFT;
			break;
		case LEFT:
			return DOWN;
			break;
		case DOWN:
			return RIGHT;
			break;
		case RIGHT: 
			return UP;
			break;

		default:
			console.log("none direction! FUNCTION: counterClockwise(direction)");
			return "???";
			break;
	}
}

function flip(direction){ //180 degree rotation
	switch(direction){
		case UP:
			return DOWN;
			break;
		case DOWN:
			return UP;
			break;
		case LEFT:
			return RIGHT;
			break;
		case RIGHT: 
			return LEFT;
			break;

		default:
			console.log("none direction! FUNCTION: flip(direction)");
			return "???";
			break;
	}
}

function inputDirectionMatchOutputDirection(input, output){
	return flip(input) === output;
}

function canPushInput(inputArr, outputArr, noMatchOutputArr){
	for(var i=0;i<inputArr.length;i++){
		for(var j=0;j<outputArr.length;j++){
			if(inputDirectionMatchOutputDirection(inputArr[i], outputArr[j])){
				return true;
			}
		}
	}

	return false;
}

function isSignalGenerating(component){
	return component.type == NOT_GATE_COMPONENT ||
		component.type == ON_BOX_COMPONENT;		
}

function pushOutput2by1(component){
	var cl = component.locations();

	var outputLocation; //location where the output comes out of
	var pushLocationX;  //x location of where the output goes
	var pushLocationY;	//y location of where the output goes

	var pushComponent;  //gotten grid component of where the pushcomponent is.

	if(component.direction === UP || component.direction === RIGHT){
		outputLocation = cl[0];
		if(component.direction === UP){	
			pushLocationX = outputLocation.x;
			pushLocationY =	outputLocation.y - 1;
			pushComponent = getAtGrid(pushLocationX, pushLocationY);
		}
		else{//right
			pushLocationX = outputLocation.x + 1;
			pushLocationY =	outputLocation.y;
			pushComponent = getAtGrid(pushLocationX, pushLocationY);
		}
	}
	else{ //down or left
		outputLocation = cl[1];
		if(component.direction === DOWN){	
			pushLocationX = outputLocation.x;
			pushLocationY =	outputLocation.y + 1;
			pushComponent = getAtGrid(pushLocationX, pushLocationY);
		}
		else if(component.direction === LEFT){//right
			pushLocationX = outputLocation.x - 1;
			pushLocationY =	outputLocation.y;
			pushComponent = getAtGrid(pushLocationX, pushLocationY);
		}
		else{
			console.log("Invalid direction in pushOutput2by1 - component printed below");
			console.log(component);
		}
	}

	pushInput(component, pushComponent, pushLocationX, pushLocationY);
}

function pushOutput1by1Straight(component){
	var cl = component.locations();

	var outputLocation; //location where the output comes out of
	var pushLocationX;  //x location of where the output goes
	var pushLocationY;	//y location of where the output goes

	var pushComponent;  //gotten grid component of where the pushcomponent is.

	outputLocation = cl[0];
	if(component.direction === UP){//up
		pushLocationX = outputLocation.x;
		pushLocationY =	outputLocation.y - 1;
		pushComponent = getAtGrid(pushLocationX, pushLocationY);
	}
	else if(component.direction === RIGHT){//right
		pushLocationX = outputLocation.x + 1;
		pushLocationY =	outputLocation.y;
		pushComponent = getAtGrid(pushLocationX, pushLocationY);
	}
	else if(component.direction === DOWN){//down
		pushLocationX = outputLocation.x;
		pushLocationY =	outputLocation.y + 1;
		pushComponent = getAtGrid(pushLocationX, pushLocationY);
	}
	else if(component.direction === LEFT){//left
		pushLocationX = outputLocation.x - 1;
		pushLocationY =	outputLocation.y;
		pushComponent = getAtGrid(pushLocationX, pushLocationY);
	}
	else{
		console.log("Invalid direction in pushOutput1by1Straight - component printed below");
		console.log(component);
	}	

	pushInput(component, pushComponent, pushLocationX, pushLocationY);
}

function pushInput(component, pushComponent, pushLocationX, pushLocationY){
	if(pushComponent != null && canPushInput(pushComponent.inputDirection(), component.outputDirection())){
		var pushComponentLoc = pushComponent.locations();
		for(var i=0;i<pushComponentLoc.length;i++){
			if(pushLocationX === pushComponentLoc[i].x && pushLocationY === pushComponentLoc[i].y){
				pushComponent.setInput(component.logic(), i);
			}
		}
	}
}


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
	this.active = false;

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

	this.rotate = function rotate(){
		if(this.direction == UP){
			this.direction = RIGHT;
		}
		else if(this.direction == RIGHT){
			this.direction = DOWN;
		}
		else if(this.direction == DOWN){
			this.direction = LEFT;
		}
		else if(this.direction == LEFT){
			this.direction = UP;
		}
		else{
			console.log("Error, invalid direction. FUNCTION component.rotate()");
		}
	}

	//gets all locations where component is located
	this.locations = function locations(){
		var ret = [];
		var cl = {
			x: this.x,
			y: this.y
		};
		ret.push(cl)

		var ol;

		if(this.width > 1 || this.height > 1){
			if(this.direction == UP || this.direction == DOWN){
				ol = {
					x: this.x + 1,
					y: this.y
				};
			}
			else{
				ol = {
					x: this.x,
					y: this.y + 1
				};
			}

			ret.push(ol);
		}

		return ret;
	}

	this.inputDirection; //directions where input can be accepted. NOT-gate facing UP will have an input direction of DOWN
	this.outputDirection; //directions where output will be pushed to. NOT-gate facing UP will have an output direction of UP

	this.input = [];			// inputs received from previous gate | either 1 or 2 inputs | defaults to 0
	this.input.push(false);		// input[0] recieves the output of the gate that connects to locations()[0]
	this.input.push(false);		// input[1] recieves the output of the gate that connects to locations()[1]

	this.reset = function reset(){ //resets component for reevaluation
		for(var h=0;h<input.length;h++){
			input[h] = false;
		}

		this.active = false;
	}

	// requires initialization in constructor functions below!
	this.logic; 	// logic for generating a '1' for output
	this.output; 	// push output(whatever is generated in logic()) to adjacent logic gate if directions align.
	this.use;		// waits delay then use case if logic returns true.

	this.setInput = function setInput(value, index){
		this.input[index] = value;
		this.active = this.logic();
		this.output();
	}
}

function and_gate(label, x, y){
	var temp = new component(
		AND_GATE_COMPONENT, //type
		label, 				//label
		2, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		2, 					//width
		1, 					//height
		x, 					//x
		y,					//y
		null				//print message
	);

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(temp.direction);
		return arr;
	}

	temp.logic = function(){
		return temp.input[0] && temp.input[1];
	}

	temp.output = function(){
		pushOutput2by1(temp);
	}

	return temp;
}

function or_gate(label, x, y){
	var temp = new component(
		OR_GATE_COMPONENT, //type
		label, 				//label
		2, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		2,	 				//width
		1,		 			//height
		x, 					//x
		y,					//y
		null				//print message
	);

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(temp.direction);
		return arr;
	}


	temp.logic = function(){
		return temp.input[0] || temp.input[1];
	}

	temp.output = function(){
		pushOutput2by1(temp);
	}


	return temp;
}

function xor_gate(label, x, y){
	var temp = new component(
		XOR_GATE_COMPONENT, //type
		label, 				//label
		2, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		2,	 				//width
		1,		 			//height
		x, 					//x
		y,					//y
		null				//print message
	);

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(temp.direction);
		return arr;
	}


	temp.logic = function(){
		return (!temp.input[0] && temp.input[1]) || (temp.input[0] && !temp.input[1]);
	}

	temp.output = function(){
		pushOutput2by1(temp);
	}


	return temp;
}

function not_gate(label, x, y){
	var temp = new component(
		NOT_GATE_COMPONENT, //type
		label, 				//label
		1, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		1,	 				//width
		1,		 			//height
		x, 					//x
		y,					//y
		null				//print message
	);

	temp.active = true;

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(temp.direction);
		return arr;
	}

	temp.logic = function(){
		return !temp.input[0];
	}

	temp.output = function(){
		pushOutput1by1Straight(temp);
	}

	return temp;
}

function l_wire(label, x, y){
	var temp = new component(
		L_WIRE_COMPONENT,	//type
		label, 				//label
		1, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		1,	 				//width
		1,		 			//height
		x, 					//x
		y,					//y
		null				//print message
	);

	temp.inputDirection = function(){
		var arr = [];
		arr.push(clockwise(temp.direction));
		arr.push(temp.direction);
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(clockwise(temp.direction));
		arr.push(temp.direction);
		return arr;
	}

	temp.logic = function(){
		return temp.input[0];
	}

	temp.output = function(){
		//todo
	}


	return temp;
}

function i_wire(label, x, y){
	var temp = new component(
		I_WIRE_COMPONENT,	//type
		label, 				//label
		1, 					//inputs
		1, 					//outputs
		UP,					//direction
		0, 					//delay
		1, 					//width
		1, 					//height
		x, 					//x
		y,					//y
		null				//print message
	);

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		return arr;
	}

	temp.logic = function(){
		return temp.input[0];
	}

	temp.output = function(){
		//todo
	}

	return temp;
}

function t_wire(label, x, y){
	var temp = new component(
		T_WIRE_COMPONENT,	//type
		label, 				//label
		1, 					//inputs
		2, 					//outputs
		UP,					//direction
		0, 					//delay
		1, 					//width
		1, 					//height
		x, 					//x
		y,					//y
		null				//print message
	);

	return temp;
}

function cross_wire(label, x, y){
	var temp = new component(
		CROSS_WIRE_COMPONENT,	//type
		label, 					//label
		1, 						//inputs
		3, 						//outputs
		UP,						//direction
		0, 						//delay
		1, 						//width
		1, 						//height
		x, 						//x
		y,						//y
		null					//print message
	);

	return temp;
}

function print_box(label, x, y, message){
	var temp = new component(
		PRINT_BOX_COMPONENT,	//type
		label, 					//label
		1, 						//inputs
		1, 						//outputs
		UP,						//direction
		0, 						//delay
		1, 						//width
		1,						//height
		x, 						//x
		y,						//y
		message					//print message
	);

	return temp;
}

function on_box(label, x, y){
	var temp = new component(
		ON_BOX_COMPONENT,		//type
		label, 					//label
		0, 						//inputs
		4, 						//outputs
		UP,						//direction
		0, 						//delay
		1, 						//width
		1, 						//height
		x, 						//x
		y,						//y
		null					//print message
	);

	return temp;
}

function var_box(label, x, y){
	var temp = new component(
		VAR_BOX_COMPONENT,		//type
		label, 					//label
		0, 						//inputs
		4, 						//outputs
		UP,						//direction
		0, 						//delay
		1, 						//width
		1,		 				//height
		x, 						//x
		y,						//y
		null					//print message
	);

	return temp;
}