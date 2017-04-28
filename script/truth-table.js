function getTruthTableAsString(){
	var ttString = $(".console #truth-table #alt-textbox #truth-tb").val();
	console.log(ttString);
	return ttString;
}

function getTruthTableAsArray(){

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