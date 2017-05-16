/* ajax call to load files from datastore */

function getOwnerAndName(){
	var pathname = window.location.pathname;

	var urlChunks = pathname.split("/");

	// /workspace/<owner>/<name>

	if(urlChunks.length == 4){
		return {
			circuitOwner: urlChunks[2],
			circuitName: urlChunks[3]
		}
	}
	else{
		return false;
	}
}

function loadFromDatastore(){
	var ownerAndName = getOwnerAndName();

	if(!getOwnerAndName()){
		console.log("nothing to load")
		return;
	} // no owner or name then exit

	$.ajax({
		url: "/workspace/loadData",
		method: "GET",
		data: ownerAndName,
		contentType: "application/json",
		success: function(data){
			console.log(data);

			if(data == "Circuit Unavailable"){
				consoleDisplayString(data);
			}
			else{
				// load data
				var toLoad = JSON.parse(data);
				console.log(toLoad);
				//toLoad.circuitContent = JSON.parse(toLoad.circuitContent);
				loadPacker(toLoad, false);
			}
			return false;
		}
	});
}

$(document).ready(function(){

	loadFromDatastore();

});