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

var circuitName = "";

var quizlet = { //all quizlet constraints (to be saved/set when submit/loaded)
	constraints: [],
	problem: "",
	answer: "",
	desc: ""
};

var loopBeforeStop = 100; //amount of times pushOutput can be called before circuitEvaluation is killed

var defaultDelayTime = 400; //delay in milliseconds

undoList = [];
redoList = [];
var clipboard = [];
