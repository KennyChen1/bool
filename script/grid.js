var grid = [];

$(document).ready(function(){

    grid.push(and_gate("first", 10,10,100,100));
    grid.push(and_gate("second", 10,10,100,100));
    grid.push(and_gate("third", 10,10,100,100));
    grid.push(and_gate("fourth", 10,10,100,100));

    for(var i=0;i<grid.length;i++){
      console.log(grid[i].print);
      console.log(grid[i].type);

      $(".workspace .grid").append("<span>"+grid[i].label+"</span>");
    }



});

$( function() {
    $( "#draggable" ).draggable({ helper: "original" });
    $( "#draggable2" ).draggable({ opacity: 0.7, helper: "clone" });
    $( "#draggable3" ).draggable({
      cursor: "move",
      cursorAt: { top: -12, left: -20 },
      helper: function( event ) {
        return $( "<div class='ui-widget-header'>I'm a custom helper</div>" );
      }
    });
    $( "#set div" ).draggable({ stack: "#set div" });
  } );