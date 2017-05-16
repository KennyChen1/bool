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


	// truth table to simpleifed expression 
	var sim1 = truthTableToBool(tt1)
	var sim2 = truthTableToBool(tt2)
	
	sim1 = mergeSort(sim1.split(" + ")).join(" + ")
	sim2 = mergeSort(sim2.split(" + ")).join(" + ")

	console.log(sim1)
	console.log(sim2)

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

function mergeSort(arr){
    if (arr.length < 2)
        return arr;
 
    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
}
 
function merge(left, right)
{
    var result = [];
	var	il = 0;
    var ir = 0;
    while (il < left.length && ir < right.length){
    	var ll = left[il]
    	var rr = right[ir]
    	if(ll[0] ==  "!"){
    		ll = left[ir].substring(1)
    	}
    	if(rr[0] == "!"){
    		rr = right[ir].substring(1)
    	}

        if (ll < rr){
            result.push(left[il++]);
        } else {
        	console.log(right[ir])
            result.push(right[ir++]);
        }
    }
 
    return result.concat(left.slice(il)).concat(right.slice(ir));
}




/* Syntax for Boolean Equations Parser*/
var BE_OR = "+";
var BE_AND = "*";
var BE_NOT = "!";
var BE_XOR = "^";
var BE_HIGH = "1";
var BE_LOW = "0";
var BE_LPAREN = "(";
var BE_RPAREN = ")";

var BE_END = ";";
var BE_EQ = "=";

function getBooleanEquation(){
	var booleq = $(".console #boolean #textbox #boolean-tb").val();

	console.log(booleq);

	return booleq;
}

function setBooleanEquation(boolEq){
	var booleq = $(".console #boolean #textbox #boolean-tb").val(boolEq);
}

function getFirstBooleanExp(){
	var boolEq = getBooleanEquation();
	var allBeq = splitBoolEqProg(boolEq);
	if(allBeq.length >= 1){
		return allBeq[0].exp;
	}
	return "";
}

function makeCircuitFromBoolEq(){
	var boolEq = getBooleanEquation();
	var allBeq = splitBoolEqProg(boolEq);
	if(allBeq.length >= 1){
		clipboard = buildCircuit(allBeq[0].exp);
	}
}

function makeBoolEqFromCircuit(){
	setBooleanEquation(assembleAllBeqInSequence(findAllSelected()));
	//traverseDownwardFromRoot();
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

//splits a multilined bool equation;
function splitBoolEqProg(boolEq){
	boolEq = boolEq.replace(/\s/g, '');

	var statements = boolEq.split(BE_END);

	var ret = [];

	for (var i = 0; i < statements.length; i++) {
		if(statements[i] != "" && statements[i] != null){
			console.log(i+" | "+statements[i]);
			var beqLabel = "";
			var beqExp = "";

			var splitted = statements[i].split(BE_EQ);

			if(splitted.length == 1){
				beqExp = splitted[0];
			}
			else if(splitted.length == 2){
				beqLabel = splitted[0];
				beqExp = splitted[1];
			}
			else{
				console.log("splitBoolEqProg, error, too many = or no =");
				console.log(splitted);
			}

			ret.push({label: beqLabel, exp: beqExp});
		}
	}

	return ret;
}

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

	return breadthTraverseParseTree([parseTree], tempClipboard, 0);
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

function assembleAllBeqInSequence(beqSeq){
	var currSel = beqSeq;

	var traverseOn = [];

	var boolEq = "";

	for (var i = 0; i < currSel.length; i++) {
		if(currSel[i].type == EQ_BOX_COMPONENT){
			traverseOn.push(currSel[i]);
		}
	}

	for (var i = 0; i < traverseOn.length; i++) {
		var bexp = traverseDownwardFromRoot(traverseOn[i]);

		var toPush = "";
		if(bexp != "" && bexp != null){
			if(traverseOn[i].label == "" || traverseOn[i].label == null){
				toPush = bexp+BE_END;
			}
			else{
				toPush = traverseOn[i].label + BE_EQ + bexp + BE_END;
			}
		}
		boolEq = boolEq + toPush;
	}

	//setBooleanEquation(boolEq);

	return boolEq;

}

function traverseDownwardFromRoot(currSel){
	//var currSel = getCurrentlySelectedNode();
	if(currSel != null){
		console.log(currSel);
		var toPrint = tdr(currSel);

		//console.log(toPrint);

		var boolEq = assembleBeqFromParseTree(toPrint)

		console.log(boolEq);

		//setBooleanEquation(boolEq);

		return boolEq;
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
	else if(component.type === EQ_BOX_COMPONENT){
		ret = new parseNode("");
		var il = getInputLocations(component);

		//var retLeft = getAtGrid(il[0].x, il[0].y);
		var retRight = getAtGrid(il[0].x, il[0].y);

		//ret.left = tdr(retLeft, component);
		ret.right = tdr(retRight, component);
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

		if(component.type === T_WIRE_COMPONENT){
			ret = new parseNode(BE_OR);
		}
		else if(component.type === CROSS_WIRE_COMPONENT){
			ret = new parseNode(BE_OR);
		}

		for (var i = 0; i < il.length; i++) {
			var currOl = il[i];

			var pushComponent = getAtGrid(currOl.x, currOl.y); //the next component in the evaluation

			if(pushComponent != null){

				if(pushComponent.type == CROSSING_WIRE_COMPONENT){
					pushComponent = crossingWireDecompose(pushComponent, component);
				}

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
					if(component.type === T_WIRE_COMPONENT){
						ret.extra.push(tdr(pushComponent,component));
					}
					else if(component.type === CROSS_WIRE_COMPONENT){
						ret.extra.push(tdr(pushComponent,component));
					}																		
					else{
						ret = tdr(pushComponent,component);
					} 
				}
			}
		}
	}

	// if there is nothing there, assume it is a 0 constant
	return ret;
}

function assembleBeqFromParseTree(rootNode){
	var ret;

	if(rootNode.extra.length > 0){

		ret = "";

		var values = []

		for (var i = 0; i < rootNode.extra.length; i++) {
			if(rootNode.extra[i] != null){
				var value = assembleBeqFromParseTree(rootNode.extra[i]);
				if(value != BE_LOW && value != null && value != ""){
					values.push(value);
				}
			}
		}

		for (var i = 0; i < values.length; i++) {
			ret = ret + values[i];
			if(i != values.length-1){
				ret = ret+BE_OR;
			}
		}

	}
	else{
		if(rootNode.right == null && rootNode.left == null){
			ret = rootNode.data;
		}
		else if(rootNode.left == null && rootNode.right != null){
			var value = assembleBeqFromParseTree(rootNode.right);
			if(rootNode.right == BE_NOT){
				if(value == BE_LOW){
					ret = BE_HIGH;
				}
				else if(value == BE_HIGH){
					ret = BE_LOW;
				}
				else{
					console.log("Error in assembleBeqFromParseTree");
				}
			}
			else{
				ret = rootNode.data+BE_LPAREN+value+BE_RPAREN;
			}
		}
		else if(rootNode.left != null && rootNode.right != null){
			var value1 = assembleBeqFromParseTree(rootNode.left);
			var value2 = assembleBeqFromParseTree(rootNode.right);
			if(rootNode.data == BE_OR){
				if(value1 == BE_HIGH || value2 == BE_HIGH){
					return BE_HIGH;
				}
				else if(value1 == BE_LOW){
					return value2;
				}
				else if(value2 == BE_LOW){
					return value1;
				}
				else{
					ret = BE_LPAREN+value1+rootNode.data+value2+BE_RPAREN;
				}
			}
			else if(rootNode.data == BE_AND){
				if(value1 == BE_LOW || value2 == BE_LOW){
					return BE_LOW;
				}
				else if(value1 == BE_HIGH){
					return value2;
				}
				else if(value2 == BE_HIGH){
					return value1;
				}
				else{
					ret = BE_LPAREN+value1+rootNode.data+value2+BE_RPAREN;
				}
			}
			else{
				ret = BE_LPAREN+value1+rootNode.data+value2+BE_RPAREN;
			}
		}
		else{
			console.log("assembleBeqFromParseTree, error.");
		}
	}

	if(ret == BE_LPAREN+BE_RPAREN){
		ret = "";
	}

	return ret;
}


/* Parse Tree Node Objects */

function parseNode(data){
	this.data = data;
	this.left = null;
	this.right = null;
	
	this.extra = [];
}
