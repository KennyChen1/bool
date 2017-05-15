/* all global data structures */

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

var owner = ""; //owner
var shared = ""; //shared
var circuitName = ""; //name
var grid = []; //all components on grid, circuit-content
var quizlet = { //all quizlet constraints (to be saved/set when submit/loaded)
	constraints: [],
	problem: "",
	answer: "",
	desc: ""
};
tags = ""; // tags


var loopBeforeStop = 100; //amount of times pushOutput can be called before circuitEvaluation is killed

var defaultDelayTime = 400; //delay in milliseconds

undoList = [];
redoList = [];
var clipboard = [];

function savePacker(){
  return {
    owner: owner,
    shared: shared,
    name: circuitName,
    circuitContent: grid,
    quizletConstraints: quizlet,
    tags: tags
  }
}

function loadPacker(obj){
  owner = obj.owner;
  shared = obj.shared;
  circuitName = obj.name;
  grid = obj.circuitContent;
  quizlet = obj.quizletConstraints;
  tags = obj.tags;
}