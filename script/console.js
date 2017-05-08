function consoleDisplayString(message){
    $(".console #debug-printed").append("<p class = 'debug-msg'>"+message+"</p>");
    $(".console #debug").scrollTop($(".console #debug")[0].scrollHeight);
}

function onClickConsoleTrigger(selected){
	$(".console-trigger").removeClass("on");
	selected.addClass("on");
}

function hideOthersAndShowSelected(others, selected){
	others.removeClass("show");
	selected.addClass("show");
}

$(document).ready(function(){
	//$(".console .console-trigger").disableSelection();

	//$(".console #clear-console").disableSelection();

	$(".console #clear-console").mousedown(function(e){
		$(".console #debug-printed .debug-msg").remove();
	});

	$(".console #debug-trigger").mousedown(function(e){
		onClickConsoleTrigger($(".console #debug-trigger"));
		hideOthersAndShowSelected($(".console .console-bottom"), $(".console #debug"));
	});

	$(".console #truth-table-trigger").mousedown(function(e){
		onClickConsoleTrigger($(".console #truth-table-trigger"));
		hideOthersAndShowSelected($(".console .console-bottom"), $(".console #truth-table"));
	});

	$(".console #boolean-trigger").mousedown(function(e){
		onClickConsoleTrigger($(".console #boolean-trigger"));
		hideOthersAndShowSelected($(".console .console-bottom"), $(".console #boolean"));
	});

	$(".console #quizlet-trigger").mousedown(function(e){
		onClickConsoleTrigger($(".console #quizlet-trigger"));
		hideOthersAndShowSelected($(".console .console-bottom"), $(".console #quizlet"));
	});
});