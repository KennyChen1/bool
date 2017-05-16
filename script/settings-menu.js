/* settings-menu options */

function promptSettingsMenu(){
	var settingsMenu = $(".settings");
	var blanket = $(".blanket");

	settingsMenu.addClass("show");
	blanket.addClass("show");

	setSettingsMenu();

	settingsMenu.offset({top: $(window).height()/2 - settingsMenu.height(), left: $(window).width()/2 - settingsMenu.width()/2});
}

function setSettingsMenu(){
	var c1 = $(".settings #loops input").val(loopBeforeStop);
	var c2 = $(".settings #delay-time input").val(defaultDelayTime);
	var c3 = $(".settings #display-delay input").prop("checked", displayDelay);
	var c4 = $(".settings #display-labels input").prop("checked", displayLabel);
	var c5 = $(".settings #display-lines input").prop("checked", displayGridLines);
	var c6 = $(".settings #display-numbers input").prop("checked", displayGridNumbers);
}

function submitSettings(){
	hideSettingsMenu();

	var c1 = $(".settings #loops input").val();
	var c2 = $(".settings #delay-time input").val();
	var c3 = $(".settings #display-delay input").is(":checked");
	var c4 = $(".settings #display-labels input").is(":checked");
	var c5 = $(".settings #display-lines input").is(":checked");
	var c6 = $(".settings #display-numbers input").is(":checked");

	loopBeforeStop = c1; //amount of times pushOutput can be called before circuitEvaluation is killed
 	defaultDelayTime = c2; //delay in milliseconds
 	displayDelay = c3; // will display delay in the grid
 	displayLabel = c4; // will display label in the grid(first 3 letters)
 	displayGridLines = c5; // show grid lines
 	displayGridNumbers = c6; // show grid numbers

 	updateGridInterface();
}

function hideSettingsMenu(){
	$(".settings").removeClass("show");
	$(".blanket").removeClass("show");
}