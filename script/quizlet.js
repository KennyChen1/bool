var notAddedComponentsToQuizletMaker = true;

function promptQuizletMaker(){
	var quizletMaker = $(".quizlet-maker");
	var blanket = $(".blanket");

	if(notAddedComponentsToQuizletMaker){
		notAddedComponentsToQuizletMaker = false;
		addComponentsToQuizletMaker();
	}

	quizletMaker.addClass("show");
	blanket.addClass("show");

	quizletMaker.offset({top: Math.abs(($(window).outerHeight(true)/2) - (quizletMaker.outerHeight(true)/2)), left: Math.abs(($(window).outerWidth(true)/2) - (quizletMaker.outerWidth(true)/2))});
	console.log($(window).outerHeight(true));
	console.log(quizletMaker.outerHeight(true));
	console.log($(window).outerWidth(true));
	console.log(quizletMaker.outerWidth(true));
}

function addComponentsToQuizletMaker(){
	var allComponents = getAllComponents();

	var constraintsDiv = $(".quizlet-maker #constraints");

	for (var i = 0; i < allComponents.length; i++) {
		var curr = allComponents[i];

		constraintsDiv.append(
			"<div class = 'constraint-input-div'>"+
				"<span class = 'constraint-label'>"+curr+"-constraint"+"</span>"+
				"<span class = 'constraint-input-right'>"+
				"<input id = "+"'"+curr+"-constraint'"+"-constraint' class = 'constraint-textbox' type = 'text' name = "+"'"+curr+"-constraint'"+" value = ''>"+
				"<button class = 'constraint-button' id = "+"'"+curr+"-constraint'"+"-constraint-up'>+</button>"+
				"<button class = 'constraint-button' id = "+"'"+curr+"-constraint'"+"-constraint-down'>-</button>"+
				"<button class = 'constraint-button' id = "+"'"+curr+"-constraint'"+"-constraint-inf'>*</button>"+
				"</span>"+
			"</div>"
		);

		console.log("hello");

	}
}

function hideQuizletMaker(){
	$(".blanket").removeClass("show");
	$(".quizlet-maker").removeClass("show");
}

function makeNewQuizlet(){
	console.log("Quizlet Made???");
}

function hideAllMenus(){
	hideSubmitMenu();
	hideQuizletMaker();
}