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
    	// doesn't work with 1 x 1 and rotated 1 x 2s
    	// so only works in default oritentation or upside down
    	if(centerComp.direction == 1 ||centerComp.direction == 2){   			// right side up or upside down   		


    		for(j = centerCompLoc[0].x-1; j <= centerCompLoc[1].x+1; j++){		// x direction to check
    			for(k = centerCompLoc[0].y-1; k <= centerCompLoc[0].y+1; k++){	// y direction to check

    				// is not the center piece to check from
    				if(!(centerCompLoc[0].x == j && centerCompLoc[0].y == k) && !(centerCompLoc[1].x == j && centerCompLoc[1].y == k)){ 
    					if(getAtGrid(j, k))	{ 		// something is found
    						
    						seenbool = false;		// variable/boolean to check if the found piece is not already been seen/added

    						// should check if this isn't comp isn't visted yet
    						for(i = 0; i < seen.length; i++){
    							if(seen[i] === getAtGrid(j, k)){									
									seenbool = true;
									break;
    							}
    						}

    						// should be that when nothing in seen has been found, it is not part of any island
    						if(seenbool == false){
    							found = false		// boolean/variable to keep track if the center has been found yet in the island

    							// this foor loop is used to determine which island to add too
    							for(v = 0; v < island.length; v++){			// get the length of how many island
    								for(w = 0; w < island[v].length; w++){	// get the length of how many components per island
										if(centerComp === island[v][w]){
											island[v].push(getAtGrid(j, k));
											found = true
											break;
										}
									}
								}
    								
							 	if(found == false)
							 		island.push([getAtGrid(j, k)])			// appends a new island to the list of island							 	
	    						seen.push(getAtGrid(j, k))					// adds to the seen list to not double add
							}	// end of seen bool == false
						}	// end of if(getAtGrid(j, k))
    				} else{
    					// does condition when there is nothing at this coordinate
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


