/*file for submitting using ajax*/

function promptSubmitMenu(){
	var submitMenu = $(".submit-menu");
	var blanket = $(".blanket");

	$(".submit-menu #circuit-name").val(circuitName);

	submitMenu.addClass("show");
	blanket.addClass("show");

	submitMenu.offset({top: $(window).height()/2 - submitMenu.height(), left: $(window).width()/2 - submitMenu.width()/2});
}

function hideSubmitMenu(){
	$(".blanket").removeClass("show");
	$(".submit-menu").removeClass("show");
}

function createCircuitFileObject(){
	var circuitFileObject; //circuit file object, excluding owner(that is done on backend)
	
	var circuitPublic = true;

	var circuitTags = "";

	if( $(".submit-menu #private").prop("checked")){
		circuitPublic = false;
	}

	if(circuitPublic){
		circuitTags = circuitTags + "#public ";
	}

	var circuitShared = $(".submit-menu #circuit-share").val();

	var circuitName = $(".submit-menu #circuit-name").val();

	circuitTags = circuitTags + $(".submit-menu #circuit-tags").val();


	var gridAsString = JSON.stringify(grid);
	var quizletAsString = JSON.stringify(quizlet);

	circuitFileObject = {
		owner: "",
		shared: circuitShared,
		name: circuitName,
		circuitContent: gridAsString,
		quizletConstraints: quizletAsString,
		tags: circuitTags
	};

	console.log(circuitFileObject);

	return circuitFileObject;
}

function sendToDatastore(circuitFileObject){
	$.ajax({
		url: "/workspace/submit",
		method: "POST",
		headers: {
            //'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
		data: JSON.stringify(circuitFileObject),
		contentType: "application/json",
		success: function(data){
			console.log(data);
			return false;
		}
	});
}

function submitToDatastore(){
	var cho = createCircuitFileObject();
	sendToDatastore(cho);
	hideSubmitMenu();
}

