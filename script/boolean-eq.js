/* Syntax for Boolean Equations Parser*/
var BE_OR = "+";
var BE_AND = "*";
var BE_NOT = "!";
var BE_LPAREN = "(";
var BE_RPAREN = ")";

function getBooleanEquation(){
	var booleq = $(".console #boolean #textbox #boolean-tb").val();

	console.log(booleq);

	return booleq;
}

function makeCircuitFromBoolEq(){
	buildCircuit(getBooleanEquation());
}

function makeBoolEqFromCircuit(){
}

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

	for (var i = 0; i < boolEq.length; i++) {
		var curr = boolEq.charAt(i);
		ret.push(curr);
	}

	return ret;
}

function splitOnChar(tbe, charToSplit){
	var parenOpen = false;

	var ret = false; 

	for (var i = 0; i < tbe.length; i++) {
		var curr = tbe[i];

		if(curr == "("){
			parenOpen = true;
		}


		if(curr == ")" && parenOpen == true){
			parenOpen = false;
		}

		if(!parenOpen){
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
				var notSplit = splitOnChar(tbe, BE_NOT);
				if(notSplit.ret){
					return notSplit.value;
				}
				else{
					return null;
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
	else{
		pushGate = var_box(curr.data, placeX, placeY);
		pushGate.direction = placeDirection;

		tempClipboard.push(pushGate);
	}
}

/* Parse Tree Node Objects */

function parseNode(data){
	this.data = data;
	this.left = null;
	this.right = null;
}
