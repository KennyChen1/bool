
function writetofile(){
	var texttowrite = JSON.stringify(grid);
    var textToSaveAsBlob = new Blob([texttowrite], {type:"text/plain"});
	var filename = prompt("Please enter the name", "");
    if(filename == null){
        return false;
    }

    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    var downloadLink = document.createElement("a");
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texttowrite));
  	downloadLink.setAttribute('download', filename);
    downloadLink.click()
}


$("#loader").change(function(){
    console.log("sadas")
	var fileToLoad = $("#loader")[0].files[0];
    //var fileToLoad = document.getElementById("loader").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        obj = JSON.parse(fileLoadedEvent.target.result);
        updateUndoList()
        grid = []
        //document.getElementById("inputTextToSave").value = textFromFileLoaded;
        for(i = 0; i < obj.length; i++){
        	addToGrid(getComponentByType(obj[i].type, obj[i].x, obj[i].y))
        	grid[i].direction = obj[i].direction
            undoList.pop()
        }

    };
    updateGridInterface();
    fileReader.readAsText(fileToLoad, "UTF-8");
 });