/* functionality for toolbar div*/

$(".toolbar #run").click(function(e){
	e.preventDefault();
	evaluate();
	updateGridInterface();
});