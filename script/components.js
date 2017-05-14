// Logic Gates
var AND_GATE_COMPONENT = "AND"; 
var OR_GATE_COMPONENT = "OR";
var XOR_GATE_COMPONENT = "XOR";
var NOT_GATE_COMPONENT = "NOT";
var BUFFER_GATE_COMPONENT = "BUFFER";

//var NAND_GATE_COMPONENT = "NAND";
//var NOR_GATE_COMPONENT = "NOR";

// Circuit Passthroughs/Wires
var L_WIRE_COMPONENT = "L"; 				// L
var I_WIRE_COMPONENT = "I"; 				// |
var T_WIRE_COMPONENT = "T"; 				// T
var CROSS_WIRE_COMPONENT = "CROSS"; 		// +
var CROSSING_WIRE_COMPONENT = "CROSSING"; 	// + (- |) seperates horizontal signal from vertical signal

// Blackboxes
var PRINT_BOX_COMPONENT = "PRINT";
var ON_BOX_COMPONENT = "ON";
var VAR_BOX_COMPONENT = "VAR";
var SWITCH_BOX_COMPONENT = "SWITCH";
var LIGHT_BOX_COMPONENT = "LIGHT";
var EQ_BOX_COMPONENT = "EQUATION";

//directions
var UP = 0;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 1;

var ALL_COMPONENTS = [];
getAllComponents(); //populates ALL_COMPONENTS

var flickTime = 500;
var stopCircuitEvaluation = false;

function getAllComponents(){

	if(ALL_COMPONENTS.length <= 0){
		ALL_COMPONENTS.push(AND_GATE_COMPONENT);
		ALL_COMPONENTS.push(OR_GATE_COMPONENT);
		ALL_COMPONENTS.push(XOR_GATE_COMPONENT);
		ALL_COMPONENTS.push(NOT_GATE_COMPONENT);
		ALL_COMPONENTS.push(BUFFER_GATE_COMPONENT);

		ALL_COMPONENTS.push(L_WIRE_COMPONENT);
		ALL_COMPONENTS.push(I_WIRE_COMPONENT);
		ALL_COMPONENTS.push(T_WIRE_COMPONENT);
		ALL_COMPONENTS.push(CROSS_WIRE_COMPONENT);
		ALL_COMPONENTS.push(CROSSING_WIRE_COMPONENT);

		ALL_COMPONENTS.push(PRINT_BOX_COMPONENT);
		//ALL_COMPONENTS.push(ON_BOX_COMPONENT);
		//ALL_COMPONENTS.push(VAR_BOX_COMPONENT);
		ALL_COMPONENTS.push(SWITCH_BOX_COMPONENT);
		ALL_COMPONENTS.push(LIGHT_BOX_COMPONENT);
		ALL_COMPONENTS.push(EQ_BOX_COMPONENT);
	}

	return ALL_COMPONENTS;
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

	this.move = function move(x,y){
		this.x = x;
		this.y = y;
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

	this.equals = function equal(otherComponent){
		return this.x === otherComponent.x && this.y === otherComponent.y && this.type === otherComponent.type;
	}

	this.outputDirectionsToDelete = [];

	this.inputDirection; //directions where input can be accepted. NOT-gate facing UP will have an input direction of DOWN
	this.outputDirection; //directions where output will be pushed to. NOT-gate facing UP will have an output direction of UP

	this.input = [];						// inputs received from previous gate | either 1 or 2 inputs | defaults to 0
	this.input.push(new inputStack());		// input[0] recieves the output of the gate that connects to locations()[0]
	this.input.push(new inputStack());		// input[1] recieves the output of the gate that connects to locations()[1]
	this.input.push(new inputStack());		// input[2] recieves output from third
	this.input.push(new inputStack());		// input[3]

	this.pushInput = function pushInput(index, signal){
		if(index >= this.input.length){
			console.log("component.pushInput(), invalid index");
		}

		if(signal){
			this.input[index].addTrue();
		}
		else{
			this.input[index].addFalse();
		}
	}

	this.getInput = function getInput(index){
		var curr = this.input[index];

		if(curr.stack.length <= 0){
			return false;
		}
		else{
			return true;
		}
	}

	this.setAllInput = function setAllInput(signal){
		for (var i = this.input.length - 1; i >= 0; i--) {
			this.input[i] = signal;
		}
	}

	this.prevOutput = null; //previous output

	this.reset = function reset(){ //resets component for reevaluation
		for(var h=0;h<this.input.length;h++){
			this.input[h] = new inputStack();
		}

		this.prevOutput = null;
	}

	// requires initialization in constructor functions below!
	this.logic; 	// logic for generating a '1' for output
	this.output; 	// push output(whatever is generated in logic()) to adjacent logic gate if directions align.
	this.activate = function activate(){
		this.active = this.logic();
		if(this.use != null){
			this.use();
		}
	}
	this.use;		// action for the circuit component to do.
	this.onclick = function onclick(){
		console.log(this.type);
	} //do this when this component is clicked on

	this.ondelete = function ondelete(){
		console.log(this.type+".ondelete()");
	}

	this.onplace = function onplace(){
		console.log(this.type+".ondelete()");
	}

	this.setInput = function setInput(prevComponent){
		return setInput(this, prevComponent);
	}

	this.output = function output(breadthTraverseList){
		return pushOutput(this, breadthTraverseList, null);
	}

	this.psuedoComponent; //misc variable, used for crossing to create a list of 2 i_wires.


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
		return temp.getInput(0) && temp.getInput(1);
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
		return temp.getInput(0) || temp.getInput(1);
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
		return (!temp.getInput(0) && temp.getInput(1)) || (temp.getInput(0) && !temp.getInput(1));
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
		return !temp.getInput(0);
	}

	return temp;
}

function buffer_gate(label, x, y){
	var temp = new component(
		BUFFER_GATE_COMPONENT, 	//type
		label, 					//label
		1, 						//inputs
		1, 						//outputs
		UP,						//direction
		0, 						//delay
		1,	 					//width
		1,		 				//height
		x, 						//x
		y,						//y
		null					//print message
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
		return temp.getInput(0);
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
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
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
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
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

	temp.inputDirection = function(){
		var arr = [];
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));

		return arr;
	}

	temp.logic = function(){
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
	}

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

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));

		return arr;
	}

	temp.logic = function(){
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
	}

	return temp;
}

function crossing_wire(label, x, y){
	var temp = new component(
		CROSSING_WIRE_COMPONENT,	//type
		label, 						//label
		2, 							//inputs
		2, 							//outputs
		UP,							//direction
		0, 							//delay
		1, 							//width
		1, 							//height
		x, 							//x
		y,							//y
		null						//print message
	);

	temp.move = function move(x,y){
		temp.x = x;
		temp.y = y;

		temp1.x = x;
		temp2.x = x;
		temp1.y = y;
		temp2.y = y;
	}

	var temp1 = i_wire(label, x, y);
	temp1.direction = RIGHT;
	var temp2 = i_wire(label, x, y);

	temp.psuedoComponent = []
	temp.psuedoComponent.push(temp1);
	temp.psuedoComponent.push(temp2);

	temp.equals = function newEquals(otherComponent){
		return otherComponent.equals(temp.psuedoComponent[0]) || otherComponent.equals(temp.psuedoComponent[1]);
	}

	temp.logic = function logic(){
		return false;
	}

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

	temp.inputDirection = function(){
		var arr = [];
		//arr.push(flip(temp.direction));
		arr.push(temp.direction);
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		//arr.push(temp.direction);

		return arr;
	}

	temp.logic = function(){
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
	}

	temp.use = function(){
		if(temp.message != null && this.logic()){
			consoleDisplayString(this.message);
		}
	}

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

	temp.inputDirection = function(){
		var arr = [];
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));

		return arr;
	}

	temp.logic = function(){
		return true;
	}

	temp.onplace = function(){
		evaluateComponents([temp]);
	}

	temp.ondelete = function(){
		var setter = switch_box("setter", temp.x, temp.y);
		evaluateComponents([temp]);
	}

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

	temp.inputDirection = function(){
		var arr = [];
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));

		return arr;
	}

	temp.logic = function(){
		return temp.getInput(0);
	}

	return temp;
}

function switch_box(label, x, y){
	var temp = new component(
		SWITCH_BOX_COMPONENT,	//type
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

	temp.inputDirection = function(){
		var arr = [];
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));

		return arr;
	}

	temp.logic = function(){
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
	}

	temp.onclick = function(){
		if(this.active){
			this.active = false;
			for (var i = temp.input.length - 1; i >= 0; i--) {
				temp.pushInput(i, false);
			}
		}
		else{
			this.active = true;
			for (var i = temp.input.length - 1; i >= 0; i--) {
				temp.pushInput(i, true);
			}
		}
		evaluateComponents([this]);

		updateGridInterface();
	}

	temp.ondelete = function(){
		console.log("SWITCH.ondelete()");
		temp.pushInput(0, false);
		temp.pushInput(1, false);
		temp.pushInput(2, false);
		temp.pushInput(3, false);

		evaluateComponents([this]);
	}

	return temp;
}

function light_box(label, x, y){
	var temp = new component(
		LIGHT_BOX_COMPONENT,	//type
		label, 					//label
		4, 						//inputs
		0, 						//outputs
		UP,						//direction
		0, 						//delay
		1, 						//width
		1,		 				//height
		x, 						//x
		y,						//y
		null					//print message
	);

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));

		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		return arr;
	}

	temp.logic = function(){
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
	}

	return temp;
}

function eq_box(label, x, y){
	var temp = new component(
		EQ_BOX_COMPONENT,		//type
		label, 					//label
		4, 						//inputs
		0, 						//outputs
		UP,						//direction
		0, 						//delay
		1, 						//width
		1,		 				//height
		x, 						//x
		y,						//y
		null					//print message
	);

	temp.inputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		arr.push(temp.direction);
		arr.push(clockwise(temp.direction));
		arr.push(counterClockwise(temp.direction));

		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		return arr;
	}

	temp.logic = function(){
		return temp.getInput(0) || temp.getInput(1) || temp.getInput(2) || temp.getInput(3);
	}

	return temp;
}


/* Circuit Evaluation Helper Functions */

function inputStack(){
	this.stack = [];

	this.addTrue = function addTrue(){
		this.stack.push(true);
	}

	this.addFalse = function addFalse(){
		this.stack.splice(this.stack.length-1, 1);
	}

	this.toString = function toString(){
		var ret = "";

		for (var i = this.stack.length - 1; i >= 0; i--) {
			ret = ret + i + " ";
			ret = ret + this.stack[i]
			ret = ret + ",";
		}

		return ret;
	}
}

function flickStopCircuitEvaluation(){
	killCircuitEvaluation();

	resetAllComponents();

	setTimeout(function(){
		allowCircuitEvaluation();
	}, flickTime);
}

function resetAllComponents(){
	for (var i = grid.length - 1; i >= 0; i--) {
		grid[i].reset();
	}
}

function killCircuitEvaluation(){ //kills the circuit evaluation (DOES NOT PAUSE EVALUATION)
	stopCircuitEvaluation = true;
}

function allowCircuitEvaluation(){ //allow circuit to be reevaluated
	stopCircuitEvaluation = false;
}

function isWire(component){
	return component.type === I_WIRE_COMPONENT || component.type === L_WIRE_COMPONENT || component.type === T_WIRE_COMPONENT || component.type === CROSS_WIRE_COMPONENT;
}

function isUnaryGate(component){
	return component.type === NOT_GATE_COMPONENT || component.type === BUFFER_GATE_COMPONENT || component.type === PRINT_BOX_COMPONENT;
}

function isMultiOutputWire(component){
	return component.type === T_WIRE_COMPONENT || component.type === CROSS_WIRE_COMPONENT;
}

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

function isSignalGenerating(component){
	return component.type == ON_BOX_COMPONENT;		
}

function getAdjacentLocationByDirection(location, direction){
	var pushLocationX;
	var pushLocationY;

	if(direction === UP){//up
		pushLocationX = location.x;
		pushLocationY =	location.y - 1;
	}
	else if(direction === RIGHT){//right
		pushLocationX = location.x + 1;
		pushLocationY =	location.y;
	}
	else if(direction === DOWN){//down
		pushLocationX = location.x;
		pushLocationY =	location.y + 1;
	}
	else if(direction === LEFT){//left
		pushLocationX = location.x - 1;
		pushLocationY =	location.y;
	}
	else{
		console.log("Error in getAdjacentLocationByDirection(direction). direction is invalid!");
	}

	return {x: pushLocationX, y: pushLocationY};
}


// gets the direction relative is from base
// if relative is above base, then the direction is UP
function getAdjacentDirectionByComponent(base, relative){

}

/* Circuit Evaluator Functions */

// push logic to output location
// output component checks if it can accept it based on input location
// keeps track of which direction the signal came from
// outputs to everywhere except where the signal came from


//takes out the two i_wires in the crossing, checks which one matches component then uses that one as the pushComponent
function crossingWireDecompose(pushComponent, component){	
	for (var i = 0; i < pushComponent.psuedoComponent.length; i++) {
		var currPpc = pushComponent.psuedoComponent[i];

		var cppcIl = getInputLocations(currPpc);

		for (var j = 0; j < cppcIl.length; j++) {
			var compMatch = getAtGrid(cppcIl[j].x, cppcIl[j].y);

			if(compMatch != null && compMatch.equals(component)){
				return pushComponent.psuedoComponent[i];
			}
		}
	}

	console.log("crossingWireDecompose: error, none of pushComponent.psuedoComponents's inputs match component!");
}

function getOutputLocations(component){
	var retOl = []; //output locations to return

	for (var i = 0; i < component.outputDirection().length; i++) {
		var curr = component.outputDirection()[i];

		if(component.width == 2 && component.height == 1){ // 2x1 gate
			if(curr === UP || curr === RIGHT){
				retOl.push(getAdjacentLocationByDirection(component.locations()[0], curr));
			}
			else{
				retOl.push(getAdjacentLocationByDirection(component.locations()[1], curr));
			}
			
		}
		else if(component.width == 1 && component.height == 1){ // 1x1 gate
			retOl.push(getAdjacentLocationByDirection(component.locations()[0], curr));
		}
		else{//error
			console.log("getOutputLocations: invalid component width or height");
		}
	}

	return retOl;
}

function getWireInputLocations(component, retIl){
	for (var i = 0; i < 4; i++) {
		retIl.push({x: -1, y: -1});
	}
	for (var i = 0; i < component.inputDirection().length; i++) {
		var curr = component.inputDirection()[i];

		retIl[curr] = getAdjacentLocationByDirection(component.locations()[0], curr);
	}

}

function getInputLocations(component){
	var retIl = []; //input locations to return

	if(isWire(component)){
		getWireInputLocations(component, retIl);
	}
	else{
		for (var i = 0; i < component.inputDirection().length; i++) {
			var curr = component.inputDirection()[i];

			if(component.width == 2 && component.height == 1){ // 2x1 gate
				retIl.push(getAdjacentLocationByDirection(component.locations()[0], curr));
				retIl.push(getAdjacentLocationByDirection(component.locations()[1], curr));			
			}
			else if(component.width == 1 && component.height == 1){ // 1x1 gate
				retIl.push(getAdjacentLocationByDirection(component.locations()[0], curr));
			}
			else{//error
				console.log("getInputLocations: invalid component width or height");
			}
		}
	}

	return retIl;
}

function pushOutput(component, breadthTraverseList, prevComponent){
	var wireBreadthTraverseList = [];
	pushOutputHelper(component, breadthTraverseList, prevComponent, wireBreadthTraverseList);

	var wbtlCopy = wireBreadthTraverseList.slice();
	wireBreadthTraverseList = [];

	var count = 0;

	while(wbtlCopy.length > 0){

		if(count > loopBeforeStop){
			console.log("More evaluations than the number set: "+loopBeforeStop);
			break;
		}

		for (var i = 0; i < wbtlCopy.length; i++) {
			var curr = wbtlCopy[i]; // curr is {pushComponent, component}

			pushOutputHelper(curr.pushComponent, breadthTraverseList, curr.component, wireBreadthTraverseList);
		}

		wbtlCopy = wireBreadthTraverseList.slice();
		wireBreadthTraverseList = [];

		updateGridInterface();

		count++;
	}
}

//component is the component to put output from
//breadthTraverseList is an empty list, contains all the gates that the depth traversal ends on.
//prevComponent is the component that called this component(could be null if its the initial call)

// pushs output until it hits a logic gate or wire with a delay
// once it hits a logic gate or wire with delay, it sets the input of that gate and pushs it to breadthTraverseList
function pushOutputHelper(component, breadthTraverseList, prevComponent, wireBreadthTraverseList){ 
	component.activate();

	var ol = getOutputLocations(component);

	for (var i = 0; i < ol.length; i++) {
		var currOl = ol[i];

		var pushComponent = getAtGrid(currOl.x, currOl.y); //the next component in the evaluation

		if(pushComponent != null){

			var prevComponentDirection; // which direction, relative to component is prevComponent. (if prevComponent is above, then UP)

			if(pushComponent.type == CROSSING_WIRE_COMPONENT){
				pushComponent = crossingWireDecompose(pushComponent, component);
			}

			var pushComponentIl = getInputLocations(pushComponent);

			var cont = true;
			if(prevComponent != null){//not the initial component
				cont = !pushComponent.equals(prevComponent);
			}

			var pci = false; //true if pushComponent's inputLocation is component.
			for (var j = 0; j < pushComponentIl.length; j++) {
				var pcCurrIl = pushComponentIl[j];
				var pcCurr = getAtGrid(pcCurrIl.x, pcCurrIl.y);

				if(pcCurr != null && pcCurr.equals(component)){
					pci = true;

					var componentIl = getInputLocations(component);
					for (var k = 0; k < componentIl.length; k++) {
						var cilCurrIl = componentIl[k];
						if(cilCurrIl != null){
							var cilCurr = getAtGrid(cilCurrIl.x, cilCurrIl.y);

							if(cilCurr != null && prevComponent != null && cilCurr.equals(prevComponent)){
								prevComponentDirection = k;
							}
						}
					}
				}
			}

			if(cont && pci && !stopCircuitEvaluation){
				console.log(component.type+" pushing to "+pushComponent.type);
				console.log(component.getInput(0)+"|"+component.getInput(1)+"|"+component.getInput(2)+"|"+component.getInput(3));


				if(setInput(pushComponent, component, prevComponentDirection)){
					return;
				}; //setInput checks where the signal came from and sets input[] accordingly

				if(isWire(pushComponent) || (isUnaryGate(pushComponent) && pushComponent.delay <= 0)){ //if its a wire and there is no delay on the component, continue
																		//TODO: remove pushCOmponent.delay <= 0 when implements buffer.
					//pushOutput(pushComponent,breadthTraverseList,component);
					wireBreadthTraverseList.push({pushComponent: pushComponent, component: component});
				} 
				else{
					breadthTraverseList.push(pushComponent); //if its not a wire, add it to the list of components, to re-output
				}
			}
			
		}
	}
}

function setInputMultiOutputComponent(component, signal){
	if(signal){
		// sets all inputs to true
		for (var i = 0; i < component.input.length; i++) {
			component.input[i] = true;
		}
	}
	else{
		var cid = component.inputDirection();
		var toCont = true;
		// if any of the adjacent component's corresponding inputs are true, then do not set this wire to false
		// example: if the wire above's up(0) input is true, then this wire should be kept as its current value
		for (var i = 0; i < cid.length; i++) { 
			var ctcLoc = getAdjacentLocationByDirection(component.locations()[0], cid[i]);
			var compToCheck = getAtGrid(ctcLoc.x, ctcLoc.y);
			if(compToCheck != null && compToCheck.input[cid[i]]){
				toCont = false;
			}
		}

		//sets all inputs to false
		if(toCont){
			for (var i = 0; i < component.input.length; i++) {
				component.input[i] = false;
			}

			evaluateComponents([component]);
		}
	}
}

//sets input of component based on prevComponent
// component - component's input to be set
// prevComponent - input based on this component's logic
// prevPrevComponentDirection - the prevComponent's previous component's direction based on prevComponent. (so if prevPrevComponent is above prevComponent, prevPrevComponentDirection is UP)
function setInput(component, prevComponent, prevPrevComponentDirection){
	var il = getInputLocations(component);

	for (var i = 0; i < il.length; i++) {
		var currIl = il[i];

		var currIlComponent = getAtGrid(currIl.x, currIl.y);

		if(currIlComponent != null){
			if(isWire(component)){ //1x1 but behaves differently
				if(currIlComponent.equals(prevComponent)){
					if(isWire(prevComponent)){ // prev & curr are both wires
						if(component.getInput(i) == prevComponent.getInput(prevPrevComponentDirection)){
							return true;
						}
						component.pushInput(i, prevComponent.getInput(prevPrevComponentDirection));
					}	
					else{ //prev is not wire, curr is wire
						if(component.getInput(i) == prevComponent.logic()){
							return true;
						}
						component.pushInput(i, prevComponent.logic());
					}				
				}
			}
			else{
				if(currIlComponent.equals(prevComponent)){
					if(isUnaryGate(component)){ //1x1
						if(component.getInput(0) == prevComponent.logic()){
							return true;
						}
						component.pushInput(0, prevComponent.logic());
					}
					else{ //2x1
						var inputIndex = i % 2; //because every 2 indices are a direction, modding it will determine which input to set

						if(component.getInput(inputIndex) == prevComponent.logic()){
							return true;
						}

						component.pushInput(inputIndex, prevComponent.logic());
					}
				}
			}
		}
	}
}


function evaluateComponents(compList){
  	var bftList = [];
  	for(var i=0;i<compList.length;i++){
    	compList[i].output(bftList);
  	}

  	updateGridInterface();

  	var loop = {
		next: function(bft){
			if(bft.length > 0){

		  		var hasDelay = false;

		  		var delayStep;

		  		bft = removeDuplicateComponents(bft);

		  		sortListByDelay(bft);

		  		var noDelayList = []
		  		var hasDelayList = []		

		  		for (var i = 0; i < bft.length; i++) {
		  			if(bft[i].delay <= 0){
						bft[i].activate();
						bft[i].output(noDelayList);
					}
					else{
						hasDelay = true;
					}
				}

				setTimeout(function(){
					for (var i = 0; i < bft.length; i++) {
						//if(bftCopy[i].delay > 0){
							bft[i].activate();
							bft[i].output(hasDelayList);
							updateGridInterface();
							loop.next(hasDelayList);
						//}
					}
				}, defaultDelayTime);

				loop.next(noDelayList);

		  		updateGridInterface();
			}
			else{
				console.log("finished!");
			}
		}
	}

	loop.next(bftList);
}

function callComponentOutput(bftCopy, bftList){

	var def = new $.Deferred();

	setTimeout(function(){
		for (var i = 0; i < bftCopy.length; i++) {
			//if(bftCopy[i].delay > 0){
				bftCopy[i].activate();
				bftCopy[i].output(bftList);
				console.log("delay > 0 "+ i +" ");
				console.log(bftCopy[i]);
				console.log(bftList);
				updateGridInterface();
			//}
		}
		def.resolve();
	}, defaultDelayTime);

	return def.promise();
}

function sortListByDelay(list){
	list.sort(function(comp, nextComp){
		return comp.delay - nextComp.delay;
	});

	return list;
}

function existsInBft(bft, comp){
	for (var i = bft.length - 1; i >= 0; i--) {
		if(bft[i].equals(comp)){
			return true;
		}
	}
	return false;
}

function removeDuplicateComponents(bft){
	var uniqueComp = [];

	for (var i = bft.length - 1; i >= 0; i--) {
		if(!existsInBft(uniqueComp, bft[i])){
			uniqueComp.push(bft[i]);
		}

	}

	return uniqueComp;
}


