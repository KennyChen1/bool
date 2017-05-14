// On evaluate, call evaluate function

beginnings = []; // beginning of all circuits

islands = []; //list contain island of circuits(list of circuits)

//evaluates the runnable tree
function evaluate(){
	killCircuitEvaluation();
	resetComponents();
	var siggen = findAllSignalGenerating(grid);
	allowCircuitEvaluation();
  	console.log(siggen);

  	evaluateComponents(siggen);

  	updateGridInterface();
}

function removeDuplicatesInBftList(list){
	uniqueArray = a.filter(function(item, pos) {
    	return a.indexOf(item) == pos;
	});
}

/* resets all components to original values */
function resetComponents(){
	for(var i=0;i<grid.length;i++){
		grid[i].reset();
	}
}

/* sees if a grid or island(or any list) has a circuit generating component*/
function hasSignalGeneratoringComponent(list){

    for (var i = 0; i < list.length; i++){
        if (isSignalGenerating(list[i])){
            return true;
        }
    }

    return false;
}

function findAllSignalGenerating(island){
	var signalGenerating = [];
	
	for(var i=0;i<island.length;i++){
		if(isSignalGenerating(island[i])){
			// if(island[i].type === NOT_GATE_COMPONENT){
			// 	var adj = getAdjacentLocationByDirection(island[i], island[i].inputDirection()[0]);
			// 	var adjComp = getAtGrid(adj.x, adj.y);
			// 	if(adjComp == null){
			// 		signalGenerating.push(island[i]);
			// 	}
			// }
			// else{
				signalGenerating.push(island[i]);
			//}
		}
	}

	return signalGenerating;
}

/* checks if the location was visited before 
* list - list of visited locations
* location - {x, y} location to check if its visited
*/
function hasVisited(list, location){

}

/* find all islands of a circuit on the grid */
// i should check if the current piece will make the two other piece adjacents
function findAllIslands(grid){
	island = [];
	seen = [];
	gridcopy = grid.slice(0) // make a copy
	count = 0
	while (gridcopy.length > 0){

		centerComp = gridcopy.pop();
		centerCompLoc = centerComp.locations() 
		/*console.log(gridcopy)
		console.log(island)
		console.log(centerComp)
		console.log(" ")*/

		found = false;
		if(island.length == 0){ 						// base case when the no compontents in the island
			island.push([centerComp]);
			seen.push(centerComp)
		} else {
   			for(v = 0; v < island.length; v++){			// get the length of how many island
				for(w = 0; w < island[v].length; w++){	// get the length of how many components per island
					if(centerComp === island[v][w]){	// go through the entire thing to check if this comp is checked
						found = true
						break;
					}
				}		
			}
			if(found == false){
				island.push([centerComp]);
				seen.push(centerComp)
			}			
		}

		// when i do the scan
		// if two or more shit is foudn
		// and is in two or more island
		// consolidate the islands
		

		// this sections gets the bounds to get scan for adjacentcy
   		jlower = centerCompLoc[0].x-1
		klower = centerCompLoc[0].y-1
    	if(centerComp.width == 2){    		
	    	if(centerComp.direction == 1 ||centerComp.direction == 2){   			// right side up or upside down
	    		jupper = centerCompLoc[1].x+1
	    		kupper = centerCompLoc[0].y+1
	    	} else{
	    		//sideways/vertical
	    		jupper = centerCompLoc[0].x+1
	    		kupper = centerCompLoc[1].y+1
	    	}
	    } else if(centerComp.width == 1){    		
	    		jupper = centerCompLoc[0].x+1
	    		kupper = centerCompLoc[0].y+1
	    }

	    count  = 0;		// counter to check for diagonalls because they are not adjacent
		for(j =jlower; j <= jupper; j++){		// x direction to check
			for(k = klower; k <= kupper; k++){	// y direction to check
				count++


				if((centerComp.width == 2) && (count == 1 || count == 3 || count == 10 || count == 12 || count == 5 || count == 8)){
					// things not to check in a 2x1
					// 1 3 10 12 are the corners, those are not adjacent
					// 5 and 8 are the centre components
					continue;
					console.log("this should never print")
				} else if((centerComp.width == 1) && (count == 1 || count == 3 || count == 7 || count == 9 || count == 5)){
					// things not to check in a 1x1
					// 1 3 10 12 are the corners, those are not adjacent
					// 5 is the centre components
					continue;
					console.log("this should never print")
				} else{
					//?????
				}	
				
				
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
								}
							}
						}

						if(found == false){	// nothing has been found to be adj so is a new island
					 		island.push([getAtGrid(j, k)])			// appends a new island to the list of island
					 	}
					 	seen.push(getAtGrid(j, k))					// adds to the seen list to not double add
					}	else{
						continue;
					}// end of if(seenbool == false)
				}	// end of if(getAtGrid(j, k))				
			}	// end of for(k = klower; k <= kupper; k++)
		}	// end of for(j =jlower; j <= jupper; j++)
	} // end of the while loop at the top
	return island
}	// end of function



/* find the beginning of an island of circuits*/
function findBeginnings(island){

}


