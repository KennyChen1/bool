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

/* checks if the location was visited before 
* list - list of visited locations
* location - {x, y} location to check if its visited
*/
function hasVisited(list, location){

}

/* find all islands of a circuit on the grid */
function findAllIslands(grid){
	island = [];
	seen = [];
	gridcopy = grid.slice(0) // make a copy
    while (gridcopy.length > 0){
   		centerComp = gridcopy.pop();
   		centerCompLoc = centerComp.locations()   		
   		if(island.length == 0){ // base case when the no compontents in the island
   			seen.push(centerComp)
   			island.push([centerComp]);
   		}


    	// if widith is 1 or 2 not checked
    	if(centerComp.direction == 1 ||centerComp.direction == 2){
    		// right side up or upside down

    		/*
    		console.log("x: " + (centerCompLoc[0].x-1) + " " + (centerCompLoc[1].x+1))	// debugging
    		console.log("y: " + (centerCompLoc[0].y-1) + " " + (centerCompLoc[0].y+1))	// prints the adjacent bounds
    		*/


    		for(j = centerCompLoc[0].x-1; j <= centerCompLoc[1].x+1; j++){
    			for(k = centerCompLoc[0].y-1; k <= centerCompLoc[0].y+1; k++){
    				if(!(centerCompLoc[0].x == j && centerCompLoc[0].y == k) && !(centerCompLoc[1].x == j && centerCompLoc[1].y == k)){ // is not the center
    					if(getAtGrid(j, k))	{ // something is found
    						
    						seenbool = false;
    						// should check if this isn't comp isn't visted yet
    						for(i = 0; i < seen.length; i++){
    							if(seen[i] === getAtGrid(j, k)){
									
									seenbool = true;
									break;
    							}
    						}
    						// should be that when nothing in seen has been found, it is not part of an island
    						if(seenbool == false){    							
	    						island[0].push(getAtGrid(j, k));
	    						seen.push(getAtGrid(j, k))	
    						}
    					}		
    				} else{
    					//console.log(j + " " + k) // the center component
    				}
    				
    			}
    		}
    	} else{	// the other orientation
    		console.log("x: " + (centerComp[0].x-1) + " " + (centerComp[0].x+1))
    		console.log("y: " + (centerComp[0].y-1) + " " + (centerComp[1].y+1))

    	}	


    	
        
    }
}

/* find the beginning of an island of circuits*/
function findBeginnings(island){

}

console.log("Hello World");
console.log(grid);


