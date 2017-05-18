/* ajax call to load files from datastore */

function getOwnerAndName(){
	var pathname = window.location.pathname;

	var urlChunks = pathname.split("/");

	// /workspace/<owner>/<name>

	if(urlChunks.length == 4){
	    var toRet = {
                owner: urlChunks[2],
                shared: "",
                name: urlChunks[3].replace(/"%20'/g, '+'),
                circuitContent: "",
                quizletConstraints: "",
                tags: ""
            };

        console.log(toRet);
		return toRet;
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
		method: "POST",
		data: JSON.stringify(ownerAndName),
		contentType: "application/json",
		success: function(data){
			console.log(data);

			if(data == "Circuit Unavailable" || data == "Invalid Circuit Name or Circuit Owner"){
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