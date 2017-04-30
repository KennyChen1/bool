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
var UP = 0;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 1;

var stopCircuitEvaluation = false;

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

	this.equals = function equal(otherComponent){
		return this.x === otherComponent.x && this.y === otherComponent.y && this.type === otherComponent.type;
	}

	this.outputDirectionsToDelete = [];

	this.inputDirection; //directions where input can be accepted. NOT-gate facing UP will have an input direction of DOWN
	this.outputDirection; //directions where output will be pushed to. NOT-gate facing UP will have an output direction of UP

	this.input = [];			// inputs received from previous gate | either 1 or 2 inputs | defaults to 0
	this.input.push(false);		// input[0] recieves the output of the gate that connects to locations()[0]
	this.input.push(false);		// input[1] recieves the output of the gate that connects to locations()[1]
	this.input.push(false);		// input[2] recieves output from third

	this.prevOutput; //previous output

	this.reset = function reset(){ //resets component for reevaluation
		for(var h=0;h<this.input.length;h++){
			this.input[h] = false;
		}

		this.outputDirectionsToDelete.splice(0, this.outputDirectionsToDelete.length); 

		if(this.type === NOT_GATE_COMPONENT || this.type === ON_BOX_COMPONENT){
			this.active = true;
		}
		else{
			this.active = false;
		}

		this.prevOutput = null;
	}

	// requires initialization in constructor functions below!
	this.logic; 	// logic for generating a '1' for output
	this.output; 	// push output(whatever is generated in logic()) to adjacent logic gate if directions align.
	this.use;		// waits delay then use case if logic returns true.

	this.setInput = function setInput(otherComponent, index){
		if(!stopCircuitEvaluation){
			this.input[index] = otherComponent.logic();
			this.active = this.logic();
			if(this.use != null){
				this.use();
			}
			updateGridInterface();

			if(this.prevOutput != this.logic()){
				this.prevOutput = this.logic();
				var component = this;
				if(this.delay > 0){
					setTimeout(function(){
						component.output();
					},this.delay);
				}
				else{
					component.output();
				}
			}
		}
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

		deleteUnneededOutputs(arr, temp.outputDirectionsToDelete);

		return arr;
	}

	temp.logic = function(){
		return temp.input[0] || temp.input[1] || temp.input[2] || temp.input[3];
	}

	temp.output = function(){
		pushOutputWires(temp);
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
		//arr.push(flip(temp.direction));
		arr.push(temp.direction);
		return arr
	}

	temp.outputDirection = function(){
		var arr = [];
		arr.push(flip(temp.direction));
		//arr.push(temp.direction);

		deleteUnneededOutputs(arr, temp.outputDirectionsToDelete);
		return arr;
	}

	temp.logic = function(){
		return temp.input[0] || temp.input[1] || temp.input[2] || temp.input[3];
	}

	temp.output = function(){
		pushOutputWires(temp);
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

		deleteUnneededOutputs(arr, temp.outputDirectionsToDelete);
		return arr;
	}

	temp.logic = function(){
		return temp.input[0] || temp.input[1] || temp.input[2] || temp.input[3];
	}

	temp.output = function(){
		pushOutputWires(temp);
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

		deleteUnneededOutputs(arr, temp.outputDirectionsToDelete);
		return arr;
	}

	temp.logic = function(){
		return temp.input[0] || temp.input[1] || temp.input[2] || temp.input[3];
	}

	temp.output = function(){
		pushOutputWires(temp);
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

		deleteUnneededOutputs(arr, temp.outputDirectionsToDelete);
		return arr;
	}

	temp.logic = function(){
		return temp.input[0] || temp.input[1] || temp.input[2] || temp.input[3];
	}

	temp.output = function(){
		pushOutputWires(temp);
	}

	temp.use = function(){
		if(temp.message != null && this.logic() == true){
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

	temp.output = function(){
		pushOutputWires(temp);
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
		return temp.input[0];
	}

	temp.output = function(){
		pushOutputWires(temp);
	}

	return temp;
}

/* Circuit Evaluation Helper Functions */

function killCircuitEvaluation(){ //kills the circuit evaluation (DOES NOT PAUSE EVALUATION)
	stopCircuitEvaluation = true;
}

function allowCircuitEvaluation(){ //allow circuit to be reevaluated
	stopCircuitEvaluation = false;
}

function isWire(component){
	return component.type === I_WIRE_COMPONENT || component.type === L_WIRE_COMPONENT || component.type === T_WIRE_COMPONENT || component.type === CROSS_WIRE_COMPONENT;
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
	return component.type == NOT_GATE_COMPONENT ||
		component.type == ON_BOX_COMPONENT;		
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

/* Circuit Evaluator Functions */

// push logic to output location
// output component checks if it can accept it based on input location
// keeps track of which direction the signal came from
// outputs to everywhere except where the signal came from

/* Unused functions */
function deleteUnneededOutputs(outputs, outputsToDelete){
	for(var j=0;j<outputsToDelete.length;j++){
		var anOutput = outputs.indexOf(outputsToDelete[j])
		if(anOutput > -1){
			outputs.splice(anOutput, 1);
		}
	}
}

function canPushInput(inputArr, outputArr, noMatchOutputArr){
	for(var i=0;i<inputArr.length;i++){
		for(var j=0;j<outputArr.length;j++){
			if(inputDirectionMatchOutputDirection(inputArr[i], outputArr[j])){
				noMatchOutputArr.push(inputArr[i]);
				return true;
			}
		}
	}

	return false;
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
	var outputDirectionToDelete = []; 
	//A->B | A is pushing an input to B
	//B's input direction(where its recieving input) is the B's output direction to delete
	if(pushComponent != null && canPushInput(pushComponent.inputDirection(), component.outputDirection(), outputDirectionToDelete)){
		var pushComponentLoc = pushComponent.locations();
		for(var i=0;i<pushComponentLoc.length;i++){
			if(pushLocationX === pushComponentLoc[i].x && pushLocationY === pushComponentLoc[i].y){
				pushComponent.outputDirectionsToDelete.push(outputDirectionToDelete[0]);
				
				if(isWire(pushComponent)){
					pushComponent.setInput(component, outputDirectionToDelete[0]);
				}
				else{
					pushComponent.setInput(component, i);
				}
			}
		}
	}
}



function pushOutputWires(component){
	var compOutDir = component.outputDirection();
	var toPush;
	for(var i=0;i<compOutDir.length;i++){
		var toPushCoords = getAdjacentLocationByDirection(component.locations()[0], compOutDir[i]);
		toPush = getAtGrid(toPushCoords.x, toPushCoords.y);

		if(toPush != null){
			var toPushInDir = toPush.inputDirection();
			var toPushLocations = toPush.locations();
			for(var j=0;j<toPushInDir.length;j++){
				for(var k=0;k<toPushLocations.length;k++){
					var toPushPrevCoords = getAdjacentLocationByDirection(toPushLocations[k], toPushInDir[j]); //input blocks of any gate block
					var toPushPrev = getAtGrid(toPushPrevCoords.x, toPushPrevCoords.y);
					if(toPushPrev != null && toPushPrev.equals(component)){
						var outputDirectionToDelete = [];
						//canPushInput(toPush.inputDirection(), component.outputDirection(), outputDirectionToDelete);

						//for(var p=0;p<outputDirectionToDelete.length;p++){
						//	toPush.outputDirectionsToDelete.push(outputDirectionToDelete[p]);
						//}

						toPush.outputDirectionsToDelete.push(toPushInDir[j]);

						if(isWire(toPush)){
							toPush.setInput(component, toPushInDir[j]);
						}
						else{
							toPush.setInput(component, k);
						}
					}
				}
			}
		}
	}
}