
function writetofile(){
	var texttowrite = gridtostring();
    var textToSaveAsBlob = new Blob([texttowrite], {type:"text/plain"});
	var filename = "savefile";
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    var downloadLink = document.createElement("a");
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texttowrite));
  	downloadLink.setAttribute('download', filename);
    downloadLink.click()
}

 
/*
function loadFileAsText(){
    var fileToLoad = $("#loader")[0].files[0];
    //var fileToLoad = document.getElementById("loader").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        obj = JSON.parse(fileLoadedEvent.target.result);
        grid = []
        //document.getElementById("inputTextToSave").value = textFromFileLoaded;
        for(i = 0; i < obj.length; i++){
        	addToGrid(getComponentByType(obj[i].type, obj[i].x, obj[i].y))
        	grid[i].direction = obj[i].direction
        }

    };
    fileReader.readAsText(fileToLoad, "UTF-8");
    //hehe = JSON.parse(textFromFileLoaded);
}*/

$("#loader").change(function(){
	var fileToLoad = $("#loader")[0].files[0];
    //var fileToLoad = document.getElementById("loader").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        obj = JSON.parse(fileLoadedEvent.target.result);
        grid = []
        //document.getElementById("inputTextToSave").value = textFromFileLoaded;
        updateUndoList()
        for(i = 0; i < obj.length; i++){
        	addToGrid(getComponentByType(obj[i].type, obj[i].x, obj[i].y))
        	grid[i].direction = obj[i].direction
        }

    };
    fileReader.readAsText(fileToLoad, "UTF-8");
 });