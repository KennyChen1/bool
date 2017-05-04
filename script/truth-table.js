function getTruthTableAsString(){
	var ttString = $(".console #truth-table #alt-textbox #truth-tb").val();
	console.log(ttString);
	return ttString;
}

function getTruthTableAsArray(){

}

function truthTableToBool(){

	// cleans input takes the table separate by row 
	tString = getTruthTableAsString().trim().split("/");

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
	// check when the sol is 1
	for(i =1; i < tString.length; i++){

		if(solCol[i] == "1"){
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
	boolStr = boolStr.slice(0,-2)


	$("#boolean-tb").text(boolStr)

	return boolStr;
}

// changes * to && and + to ||
// or * to AND and + to OR
function convert(str){

	//G5E6L6-4L2WWU3UX7

	var x = str.split('*').join(' AND ');
	// replace + with ||
	x = x.split('+').join('OR');
	x = x.split('!').join('NOT ');

	return x;
}

function test(){
	var wolfram = require('wolfram-alpha').createClient("G5E6L6-4L2WWU3UX7", opts);

	var results = yield wolfram.query("integrate 2x");
	console.log("Result: %j", results);
}

/*
 * gets turns the boolean equation to the table
 */ 
function eqToTable(){
	// gets the unique letters and char
	var letters = getBooleanEquation().replace(/[^a-zA-Z]+/g, '');
	uniques = letters.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');

	// zero array of length of unique char in equation to start pritning
	printStr = Array.apply(null, Array(uniques.length)).map(Number.prototype.valueOf,0);
	printStr[printStr.length-1] = 1

	tableString = "- " + uniques.split('').join(' ') + " sol/\n";

	// strCopt is the boolean  with || and && instead of + and *
	// replace * with &&
	strCopt = getBooleanEquation().split('*').join('&&');
	// replace + with ||
	strCopt = strCopt.split('+').join('||');


	for(i = 0; i < Math.pow(2,uniques.length); i++){
		tableString = tableString + i;

		// increments the zeros
		for(k = 0; k < printStr.length; k++){
			// want to check if it's time to increment and if it's too soon to increment
			//(
			if((i%Math.pow(2,printStr.length-k-1) == 0) && (i+2 > Math.pow(2,printStr.length-k-1)) ){
				//console.log(Math.pow(2,printStr.length-k-1))
				printStr[k] = (printStr[k] + 1)%2
			}
		}

		tempStr = strCopt;
		var x = uniques.split("");
		for(z = 0; z < printStr.length; z++){
			//console.log(x[z]+" " + printStr[z])
			tempStr = tempStr.split(x[printStr.length-z-1]).join(printStr[z])
		}

		// prints the zeros
		for(j = 0; j < printStr.length; j++){ 
			tableString += (" " + printStr[j]);
		}

		// this changes true false text to 0 and 1
		if(eval(tempStr) == false)
			tempStr = 0
		if(eval(tempStr) == true)
			tempStr = 1

		// adds the result and ending
		tableString+= (" " + tempStr + " /\n");


	}
	console.log(tableString)

	$("#truth-tb").text(tableString)
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