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
var displayDelay = true; // will display delay in the grid
var displayLabel = true; // will display label in the grid(first 3 letters)

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

function loadPacker(obj, loadGrid){
  clearAll();
  owner = obj.owner;
  shared = obj.shared;
  circuitName = obj.name;
  if(loadGrid){
    grid = obj.circuitContent;
  }
  else{
    updateUndoList();
    for(i = 0; i < obj.circuitContent.length; i++){
        var curr = obj.circuitContent[i];
        var toAdd = getComponentByType(curr.type, curr.x, curr.y);
        toAdd.setLoadValues(curr.label, curr.message, curr.delay, curr.flipped, curr.direction); 
        addToGridOnLoad(toAdd);   

        undoList.pop();
    }
  }
  quizlet = obj.quizletConstraints;
  tags = obj.tags;
}

function clearAll(){
  owner = ""; //owner
  shared = ""; //shared
  circuitName = ""; //name
  grid = []; //all components on grid, circuit-content
  quizlet = { //all quizlet constraints (to be saved/set when submit/loaded)
    constraints: [],
    problem: "",
    answer: "",
    desc: ""
  };
  tags = ""; // tags
}