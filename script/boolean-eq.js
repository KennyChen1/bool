function getBooleanEquation(){
	var booleq = $(".console #boolean #textbox #boolean-tb").val();

	console.log(booleq);

	return booleq;
}

function makeCircuitFromBoolEq(){
	parseBooleanEquation(getBooleanEquation());
}

function makeBoolEqFromCircuit(){

}

function isLetter(str){
	return str.length === 1 && str.match(/[a-z]/i);
}

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
				console.log(curr);
				var currRoot;
				

				if(charToSplit == "!"){
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

	console.log(parseTree);
}

function parseBooleanEq(tbe){

	if(tbe.length == 0){
		//console.log("Nothing");
		return null;
	}
	else if(tbe.length == 1){
		console.log(tbe[0]);
		return new parseNode(tbe[0]);
	}
	else if(tbe[0] == "(" && tbe[tbe.length-1] == ")"){ // eq -> (eq)
		return parseBooleanEq(tbe.slice(1,tbe.length-1));
	}
	else{
		var orSplit = splitOnChar(tbe, "+");
		if(!orSplit){
			var andSplit = splitOnChar(tbe, "*");
			if(!andSplit){
				var notSplit = splitOnChar(tbe, "!");
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

/* Parse Tree Node Objects */

function parseNode(data){
	this.data = data;
	this.left = null;
	this.right = null;
}
