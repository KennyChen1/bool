/*
	compares if exp1 and exp2 are logically equivallent
	exp1 and exp2 are boolean expressions

	true if logically equal
	false otherwise
*/
function booleanIsEqual(exp1, exp2){

	// get tt string
	var tt1 = eqToTable(exp1)
	var tt2 = eqToTable(exp2)

	// truth table to expression 
	var sim1 = truthTableToBool(tt1)
	var sim2 = truthTableToBool(tt2)

	// make truth table from simplified expression
	var stt1 = eqToTable(sim1)
	var stt2 = eqToTable(sim2)

	// split up the rows
	var str1 = stt1.split("\n")
	var str2 = stt2.split("\n")

	// remove the first row which is the header
	str1.shift()
	str2.shift()

	// combine the leftover rows
	str1 = str1.join("\n")
	str2 = str2.join("\n")

	// return the solutuon
	return str1 == str2

}




/* Syntax for Boolean Equations Parser*/
var BE_OR = "+";
var BE_AND = "*";
var BE_NOT = "!";
var BE_XOR = "#";
var BE_HIGH = "1";
var BE_LOW = "0";
var BE_LPAREN = "(";
var BE_RPAREN = ")";

function getBooleanEquation(){
	var booleq = $(".console #boolean #textbox #boolean-tb").val();

	console.log(booleq);

	return booleq;
}

function setBooleanEquation(boolEq){
	var booleq = $(".console #boolean #textbox #boolean-tb").val(boolEq);
}

function makeCircuitFromBoolEq(){
	buildCircuit(getBooleanEquation());
}

function makeBoolEqFromCircuit(){
	traverseDownwardFromRoot();
}

/* Boolean Equation to Circuit */

function breadthTraversal(list, count){
	var nextList = [];

	if(list.length <= 0){
		return ;
	}

	for (var i = 0; i < list.length; i++) {
		var curr = list[i]
		var currLeft = list[i].left;
		var currRight = list[i].right;
		if(currLeft != null){
			nextList.push(currLeft);
		}
		if(currRight != null){
			nextList.push(currRight);
		}

		console.log(curr);
	}

	console.log("\n--------next---------");

	count++;

	return breadthTraversal(nextList, count);
}

function isLetter(str){
	return str.length === 1 && str.match(/[a-z]/i);
}

/* Functions for parsing and tokenizing the boolean equations */
function tokenizeBoolEq(boolEq){
	boolEq = boolEq.replace(/\s/g, '');

	var ret = [];

	var letterStart = false;
	var letterStartLoc;

	for (var i = 0; i < boolEq.length; i++) {
		var curr = boolEq.charAt(i);
		if(isLetter(curr)){
			if(!letterStart){
				letterStart = true;
				letterStartLoc = i;
			}
		}
		else{
			if(letterStart){
				letterStart = false;
				ret.push(boolEq.substring(letterStartLoc, i));
				letterStartLoc = null;
				ret.push(curr);
			}
			else{
				letterStart = false;
				ret.push(curr);
			}
		}
	}

	if(letterStart){
		ret.push(boolEq.substring(letterStartLoc, boolEq.length));
	}
	console.log("tokenized beq");
	console.log(ret);
	return ret;
}

function splitOnChar(tbe, charToSplit){
	var parenOpen = false;

	var ret = false; 

	var stack = [];

	for (var i = 0; i < tbe.length; i++) {
		var curr = tbe[i];

		if(curr == "("){
			stack.push("(");
		}


		if(curr == ")"){
			stack.splice(stack.length-1, 1);
		}

		if(stack.length <= 0){
			if(curr == charToSplit){
				//console.log(curr);
				var currRoot;
				

				if(charToSplit == BE_NOT){
					currRoot = new parseNode(curr);
					currRoot.right = parseBooleanEq(tbe.slice(i+1, tbe.length));
				}
				else{
					var theLeft = parseBooleanEq(tbe.slice(0, i));
					var theRight = parseBooleanEq(tbe.slice(i+1, tbe.length));

					currRoot = new parseNode(curr);
					currRoot.left = theLeft;
					currRoot.right = theRight;
				}

				ret = {
					ret: true,
					value: currRoot
				};

				break;
			}
		}
	}

	return ret;
}

function parseBooleanEquation(boolEq){
	var tbe = tokenizeBoolEq(boolEq);//tokenized boolean equation
	var parseTree = parseBooleanEq(tbe);

	//console.log(parseTree);
	
	return parseTree;
}

function parseBooleanEq(tbe){

	if(tbe.length == 0){
		return null;
	}
	else if(tbe.length == 1){
		//console.log(tbe[0]);
		return new parseNode(tbe[0]);
	}
	else if(tbe[0] == BE_LPAREN && tbe[tbe.length-1] == BE_RPAREN){ // eq -> (eq)
		return parseBooleanEq(tbe.slice(1,tbe.length-1));
	}
	else{
		var orSplit = splitOnChar(tbe, BE_OR);
		if(!orSplit){
			var andSplit = splitOnChar(tbe, BE_AND);
			if(!andSplit){
				var xorSplit = splitOnChar(tbe, BE_XOR);
				if(!xorSplit){
					var notSplit = splitOnChar(tbe, BE_NOT);
					if(notSplit.ret){
						return notSplit.value;
					}
					else{
						return null;
					}
				}
				else{
					return xorSplit.value;
				}
			}
			else{
				return andSplit.value;
			}
		}
		else{
			return orSplit.value;
		}		
	}

}

function buildCircuit(boolEq){
	var parseTree = parseBooleanEquation(boolEq);

	var tempClipboard = [];

	clipboard = breadthTraverseParseTree([parseTree], tempClipboard, 0);
}

function breadthTraverseParseTree(list, tempClipboard, count){
	var nextList = [];

	if(list.length <= 0){
		return tempClipboard;
	}

	for (var i = 0; i < list.length; i++) {
		var curr = list[i]
		var currLeft = list[i].left;
		var currRight = list[i].right;
		if(currLeft != null){
			nextList.push(currLeft);
		}
		if(currRight != null){
			nextList.push(currRight);
		}

		putCircuitsOnClipboard(tempClipboard, i, count, curr)
		console.log(curr);
	}

	console.log("\n--------next---------");

	count++;

	return breadthTraverseParseTree(nextList, tempClipboard, count);
}

function putCircuitsOnClipboard(tempClipboard, i, count, curr){
	var placeY = i * 2;
	var placeX = count * 3;
	var placeDirection = LEFT;

	var pushGate;

	if(curr.data == BE_NOT){
		pushGate = not_gate(null, placeX, placeY);
		pushGate.direction = placeDirection;

		tempClipboard.push(pushGate);
	}
	else if(curr.data == BE_AND){
		pushGate = and_gate(null, placeX, placeY);
		pushGate.direction = placeDirection;

		tempClipboard.push(pushGate);
	}
	else if(curr.data == BE_OR){
		pushGate = or_gate(null, placeX, placeY);
		pushGate.direction = placeDirection;

		tempClipboard.push(pushGate);
	}
	else if(curr.data == BE_XOR){
		pushGate = xor_gate(null, placeX, placeY);
		pushGate.direction = placeDirection;

		tempClipboard.push(pushGate);
	}
	else if(curr.data == BE_HIGH){
		pushGate = on_box(null, placeX, placeY);
		pushGate.direction = placeDirection;

		tempClipboard.push(pushGate);
	}
	else if(curr.data == BE_LOW){
		//nothing lol
		//its low(0) duh.
	}
	else{
		pushGate = switch_box(curr.data, placeX, placeY);
		pushGate.direction = placeDirection;

		tempClipboard.push(pushGate);
	}
}

/* Circuit to Boolean Equation */

function getCurrentlySelectedNode(){
	if(selectedSameSquare()){
		var selectedComp = getAtGrid(selected.begin.x, selected.begin.y);

		return selectedComp;
	}
	else{
		consoleDisplayString("Please select a single square");
		console.log("Please selected a single square");
	}

}

function traverseDownwardFromRoot(){
	var currSel = getCurrentlySelectedNode();
	if(currSel != null){
		console.log(currSel);
		var toPrint = tdr(currSel);

		console.log(toPrint);

		var boolEq = assembleBeqFromParseTree(toPrint)

		console.log(boolEq);

		setBooleanEquation(boolEq);
	}
}

// traverses grid backward output to input, and makes a parseTree out of the circuit components
function tdr(component, prevComponent){ 
	var ret;

	if(component == null){
		return new parseNode(0);
	}
	else if(component.type === ON_BOX_COMPONENT){
		ret = new parseNode(1);
	}
	else if(component.type === SWITCH_BOX_COMPONENT){
		ret = new parseNode(component.label);
	}
	else if(component.type === AND_GATE_COMPONENT){
		ret = new parseNode(BE_AND);
		var il = getInputLocations(component);

		var retLeft = getAtGrid(il[0].x, il[0].y);
		var retRight = getAtGrid(il[1].x, il[1].y);

		ret.left = tdr(retLeft, component);
		ret.right = tdr(retRight, component);
	}
	else if(component.type === OR_GATE_COMPONENT){
		ret = new parseNode(BE_OR);
		var il = getInputLocations(component);

		var retLeft = getAtGrid(il[0].x, il[0].y);
		var retRight = getAtGrid(il[1].x, il[1].y);

		ret.left = tdr(retLeft, component);
		ret.right = tdr(retRight, component);
	}
	else if(component.type === XOR_GATE_COMPONENT){
		ret = new parseNode(BE_XOR);
		var il = getInputLocations(component);

		var retLeft = getAtGrid(il[0].x, il[0].y);
		var retRight = getAtGrid(il[1].x, il[1].y);

		ret.left = tdr(retLeft, component);
		ret.right = tdr(retRight, component);
	}
	else if(component.type === NOT_GATE_COMPONENT){
		ret = new parseNode(BE_NOT);
		var il = getInputLocations(component);

		var retRight = getAtGrid(il[0].x, il[0].y);

		ret.right = tdr(retRight, component);
	}
	else{// is wire, so do its checks and continue
		var il = getInputLocations(component);

		for (var i = 0; i < il.length; i++) {
			var currOl = il[i];

			var pushComponent = getAtGrid(currOl.x, currOl.y); //the next component in the evaluation

			if(pushComponent != null){

				var pushComponentOl = getOutputLocations(pushComponent);

				var cont = true;
				if(prevComponent != null){//not the initial component
					cont = !pushComponent.equals(prevComponent);
				}

				var pci = false; //true if pushComponent's outputLocation is component.
				for (var j = 0; j < pushComponentOl.length; j++) {
					var pcCurrIl = pushComponentOl[j];
					var pcCurr = getAtGrid(pcCurrIl.x, pcCurrIl.y);

					if(pcCurr != null && pcCurr.equals(component)){
						pci = true;
					}
				}

				if(cont && pci){
					//console.log(component.type+" pushing to "+pushComponent.type);
																		
					ret = tdr(pushComponent,component); 
				}
			}
		}
	}

	// if there is nothing there, assume it is a 0 constant
	return ret;
}

function assembleBeqFromParseTree(rootNode){
	var ret;

	if(rootNode.right == null && rootNode.left == null){
		ret = rootNode.data;
	}
	else if(rootNode.left == null && rootNode.right != null){
		ret = rootNode.data+BE_LPAREN+assembleBeqFromParseTree(rootNode.right)+BE_RPAREN;
	}
	else if(rootNode.left != null && rootNode.right != null){
		ret = BE_LPAREN+assembleBeqFromParseTree(rootNode.left)+rootNode.data+assembleBeqFromParseTree(rootNode.right)+BE_RPAREN;
	}
	else{
		console.log("assembleBeqFromParseTree, error.");
	}

	return ret;
}


/* Parse Tree Node Objects */

function parseNode(data){
	this.data = data;
	this.left = null;
	this.right = null;
}
