/* Gets the boolean expression from the text field under the "Truth Table" tab
 *
 * 		returns the string representation of the truth table
 */
function getTruthTableAsString(){
	var ttString = $(".console #truth-table #alt-textbox #truth-tb").val();
	return ttString;
}


/* Converts the truth table into a boolean equation that is the simplfied sum of minterms
 *	If no parameters pssed the table from the Truth Table text box will be passed
 *	Else the first parameter will be converted
 *	
 *	returns the string of the boolean expression if an arguement was passed in
 */
function truthTableToBool(){
	
	// cleans input takes the table separate by row 
	if(arguments.length == 0){ // nothing was passed in		
		tString = getTruthTableAsString().trim().split("/");
	} else{
		tString = arguments[0].trim().split("/");
	}


	// the columns that has solutions
	solCol = [];
	// splits each rows into cols
	for(i = 0; i < tString.length; i++){
		tString[i] = tString[i].trim().split(" ");

		// gets the col of solutions
		if(1){
			solCol.push(tString[i][tString[i].length-1])
		}
	}
	boolStr = ""
	minterms = []
	// check when the sol is 1
	for(i =1; i < tString.length; i++){

		if(solCol[i] == "1"){
			console.log()
			minterms.push(parseInt(tString[i].join("").substring(1,tString[i].length-1),2))
			// check for the col that has 1 
			// check from 1 to n-1; don't check frsti and last
			for(j = 1; j < tString[i].length-1; j++){

				// checks if 0 or 1 to add "!"
				if(tString[i][j] == "1"){
					boolStr = boolStr + tString[0][j] 
				} else if(tString[i][j] == "0"){
					boolStr = boolStr + "!" +tString[0][j] 
				}

				// adds the and *
				if(j != tString[i].length-2){
						boolStr = boolStr + "*"
				}
			}
			boolStr = boolStr + " + "
		}
	}

	aa = qm(minterms, tString[0].length-2) // have to process the solution
	aa = aa.split(" + ")

	vars = tString[0].slice(1,-1)


	for(i = 0; i < aa.length; i++){ // replace "a'" with "!a"
		aa[i] = aa[i].split("").join("*").replace(/[A-Za-z]\*\'/g,  function(match) {
		    return "!" + match.substring(0, match.length-2);
		}).split("*");
	}

	for(i = 0; i < aa.length; i++){ // this goes though all the terms
		for(j = 0; j < aa[i].length; j++){ // this goes though the variables in a term
			if(aa[i][j].length == 2){ 
				// there is a !
				aa[i][j] = aa[i][j].substr(0, 1) + vars[aa[i][j].charCodeAt(1)-97] + aa[i][j].substr(1 + 1);
			} else{
				// there is only the variable
				aa[i][j] =  vars[aa[i][j].charCodeAt(0)-97];
			}
		}
		aa[i] = aa[i].join("*")
	}

	boolStr = aa.join(" + ")

	
// nothing was passed in		
	if(arguments.length == 0){ 
		$("#boolean-tb").val(boolStr)
	}

	return boolStr;
}


/* wrapper function to call the functions needed to simplify an expression
 * 		eq - the expression that to be simplified
 *
 *		returns the simplfied 
 */
function simplifyBool(eq){
	// i need to convert the boolean equation to truth table
	// from the truth table i get the minterms
	// which is sused to simply the boolean equation
	
	// first step is to convert the eq to table
	var tableStr = eqToTable(eq) // this gets the table
	return truthTableToBool(tableStr)
	// second step is to get the minterms from this  table

	
}



/*	
	converts a boolean equation to it's truth table representation

	paremeters 
		if none, the function will parse the boolean equation in the text box
		if one or more than arguements[0] will be the equation passed in to the function and will not change the table
	returns the string represenation of the boolean eqation
*/
function eqToTable(){
	// gets the unique letters and char
	if(arguments.length == 0){
		// gets the variables
		var variables = getFirstBooleanExp().split(/[ +*!()^]/).filter(function(item, i, ar){ if(item != "")return ar.indexOf(item) === i; });

		var letters = getFirstBooleanExp().replace(/[^a-zA-Z]+/g, '');

		// strCopt is the boolean  with || and && instead of + and *
		// replace * with &&
		var strCopt = getFirstBooleanExp().split('*').join('&&');
		// replace + with ||
	} else{
		var variables = arguments[0].split(/[ +*!()^]/).filter(function(item, i, ar){ if(item != "")return ar.indexOf(item) === i; });

		var letters = arguments[0].replace(/[^a-zA-Z]+/g, '');

		var strCopt = arguments[0].split('*').join('&&');
	}

	strCopt = strCopt.split('+').join('||');


	//uniques = letters.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');

	// zero array of length of unique char in equation to start pritning
	var printStr = Array.apply(null, Array(variables.length)).map(Number.prototype.valueOf,0);
	printStr[printStr.length-1] = 1

	var tableString = "- " + variables.join(' ') + " sol/\n";

	


	for(i = 0; i < Math.pow(2,variables.length); i++){
		tableString = tableString + i;

		// increments the zeros
		for(k = 0; k < printStr.length; k++){
			// want to check if it's time to increment and if it's too soon to increment
			//(
			if((i%Math.pow(2,printStr.length-k-1) == 0) && (i+2 > Math.pow(2,printStr.length-k-1)) ){
				printStr[k] = (printStr[k] + 1)%2
			}
		}

		// solution col bit
		var rowSol = strCopt;
		var x = variables;
		// replaces vars with bits
		for(z = 0; z < printStr.length; z++){
			rowSol = rowSol.split(x[z]).join(printStr[z])
		}

		// prints the bits
		for(j = 0; j < printStr.length; j++){ 
			tableString += (" " + printStr[j]);
		}

		// this changes true false text to 0 and 1
		if(eval(rowSol) == false)
			rowSol = 0
		if(eval(rowSol) == true)
			rowSol = 1

		// adds the result and ending
		tableString+= (" " + rowSol + " /\n");


	}


	if(arguments.length == 0){
		$("#truth-tb").val(tableString)
	}

	return tableString;
}

/* Useless functions, may be useful in the future

var ttSelected; //keeps track of which box in the table u currently have selected(coords)
var rowNum = 1000; 
var colLabel = "B";

function addColumnToTruthTable(){
	var headerRow = $(".console #truth-table #input .header");
	var allRows = $(".console #truth-table #input .tt-row");
	headerRow.append("<th>"+colLabel+"</th>");
	allRows.append("<td>0</td>");

	var numCols = Math.pow(2, $(".console #truth-table #input th").length - 1) - allRows.length;

	for (var i = numCols - 1; i >= 0; i--) {
		addRowToTruthTable(i);
	}
}

function addRowToTruthTable(rowNum){
	var theTable = $(".console #truth-table #input .table-input");
	var rowToAdd = $("<tr>", {"class": "tt-row"});
	var rowSize = $(".console #truth-table #input .header th").length;

	rowToAdd.append("<td class = 'row-num'>"+rowNum+"</td>");

	for (var i = rowSize - 1; i >= 1; i--) {
		rowToAdd.append("<td>0</td>");
	}

	console.log(rowSize);


	theTable.append(rowToAdd);
}

function deleteColumnFromTruthTable(){
	var headerRow = $(".console #truth-table #input .header");
	var allRows = $(".console #truth-table #input .tt-row");
	if(headerRow.find("th").length > 1){
		var headerRowTh = headerRow.find("th:last");
		var allRowsTh = allRows.find("td:last");

		for (var i = (allRowsTh.length)/2; i >= 1; i--) {
			deleteRowFromTruthTable();
		}

		headerRowTh.remove();
		allRowsTh.remove();
	}
}

function deleteRowFromTruthTable(){
	var rows = $(".console #truth-table #input .table-input");

	rows.find("tr:last").remove();
}


function convertTextBoxToTruthTable(){

}

function convertTruthTableToTextBox(){

}

function toggleTruthTableTextBox(){

}
*/