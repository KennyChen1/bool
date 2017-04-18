/* all global data structures */

var grid = []; //all components on grid

var p = 0; //padding
var box = 50 //size of each grid box = 50x50

var selected = {
  begin: {
    x: 0,
    y: 0
  },

  size: {
    width: 0,
    height: 0
  }
}


undoList = [];
redoList = [];
var clipboard = [];
