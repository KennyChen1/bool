// On evaluate, call evaluate function

beginnings = []; // beginning of all circuits

islands = []; //list contain island of circuits(list of circuits)

// makes grid into a runnable tree
function compile(){

}

//evaluates the runnable tree
function evaluate(){

}

/* sees if a grid or island(or any list) has a circuit generating component*/
function hasSignalGeneratoringComponent(list){

    for (var i = 0; i < list.length; i++){
        if (list[i].type == NOT_GATE_COMPONENT || list[i].type == ON_BOX_COMPONENT){
            return true;
        }
    }

    return false;
}

/* find all islands of a circuit on the grid */
function findAllIslands(grid){
    for (var i = 0; i < grid.length; i++){
        
    }
}

/* find the beginning of an island of circuits*/
function findBeginnings(island){

}

console.log("Hello World");
console.log(grid);


