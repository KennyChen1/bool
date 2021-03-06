function node(coords, g, h, parent){
	this.x = coords.x;
	this.y = coords.y;
	this.g = g;

	this.crossing = false;

	this.h = h;
	this.f = g+h;
	this.parent = parent;
}


function astar(start, goal){

		if(start.x == goal.x && start.y == goal.y)
			return false;
		//if(getAtGrid(goal.x, goal.y))
			//return null;
// g is the cost it took to get to the node, most likely the number of squares we passed by from the start.
// each cost is 1, ie one square per move
// h is our guess as to how much it'll cost to reach the goal from that node.
	
	// start.g is zero because it has not moved yet
	// start.h is the total distance because it hasn't moved yet
	// start.f is the same as start.h because the total distance list is the total distance	
	start.g = 0;
	start.h = (Math.abs(goal.x-start.x) + Math.abs(goal.y-start.y))		
	start.f = start.h;								
	

    // The set of nodes already evaluated.
	closedSet = []

	// The set of currently discovered nodes that are not evaluated yet.
    // Initially, only the start node is known.
    openSet = [start]

    //getAtGrid

    // For each node, which node it can most efficiently be reached from.
    // If a node can be reached from many nodes, cameFrom will eventually contain the
    // most efficient previous step.
    //cameFrom = 
    var minf = start;
    z = 0;
    //while(z < 20){
    while(openSet.length){
		if(z > 10000){
			console.log("can't find path")
			return;
		}
    	z++;

    	// find the node with the least f on the open list, call it "q"
    	minfindex = 0;
    	for(i = 0; i < openSet.length; i++){
    		if(minf.f >= openSet[i].f){
    			minf = openSet[i];
    			minfindex = i;
    		}
    	}
    	// pop q off the open list
    	minf = openSet.splice(minfindex, 1)[0]
    	//console.log(pooped)
    	// generate q's 8 successors and set their parents to q

    	/*
		for each successor
			if successor is the goal, stop the search
		    successor.g = q.g + distance between successor and q
		    successor.h = distance from goal to successor
		    successor.f = successor.g + successor.h

		    if a node with the same position as successor is in the OPEN list \
		        which has a lower f than successor, skip this successor
		    if a node with the same position as successor is in the CLOSED list \ 
		        which has a lower f than successor, skip this successor
		    otherwise, add the node to the open list
		end
    	*/
    	successors = [];

    		

    	if((getAtGrid(minf.x,minf.y+1) == null || getAtGrid(minf.x,minf.y+1).type == "I" && getAtGrid(minf.x,minf.y+1).direction %2  != 0) 
    		&& minf.x  >= 0 && minf.y+1 >= 0){

    		// move down

    		
    		var totalDist = Math.abs(goal.x-minf.x) + Math.abs(goal.y-(minf.y+1));
    		var push = new node({x: minf.x, y: minf.y+1}, minf.g+1, totalDist, minf)

    		if(getAtGrid(minf.x,minf.y+1) != null && getAtGrid(minf.x,minf.y+1).type == "I"){
    			push.crossing = true;
    		}
		    	/*	
    		yyy = 0;

    		if(push.parent && push.parent.parent &&  push.parent.parent.parent){	
				if(push.crossing && push.parent.crossing && push.parent.parent.crossing){
					yyy = push.parent.parent.y - push.parent.y
					console.log(push)
					console.log(push.parent)
					console.log(push.parent.parent)
					console.log(yyy)
					console.log(" dfgdfsg  \n\n")
				}
				
			}

    		var xxx = 0;

			if(push.parent.crossing && !push.parent.parent.crossing){	
				xxx = push.parent.x - push.parent.parent.x
			}
			if(!xxx && !yyy){
	    		successors.push(push)
			}*/
			var bool = false;
			if(push.parent){
				if(getAtGrid(push.parent.x,push.parent.y))
					if(push.parent.crossing)
						if(getAtGrid(push.parent.x,push.parent.y).direction % 2 == 0)							
							bool = true;

			} 
			if(!bool)
    			successors.push(push)

    	}
    	
    	if((getAtGrid(minf.x,minf.y-1) == null || getAtGrid(minf.x,minf.y-1).type == "I" && getAtGrid(minf.x,minf.y-1).direction %2 != 0) && minf.x >= 0 && minf.y-1 >= 0){
    		// move up
	    	var totalDist = Math.abs(goal.x-minf.x) + Math.abs(goal.y-(minf.y-1));
    		var push = new node({x: minf.x, y: minf.y-1}, minf.g+1, totalDist, minf)
			
			if(getAtGrid(minf.x,minf.y-1) != null && getAtGrid(minf.x,minf.y-1).type == "I"){
				push.crossing = true;
			}	
			
			var bool = false;
			if(push.parent){
				if(getAtGrid(push.parent.x,push.parent.y))
					if(push.parent.crossing)
						if(getAtGrid(push.parent.x,push.parent.y).direction % 2 == 0)							
							bool = true;

			} 
			if(!bool)
    			successors.push(push)
    	}

     	if((getAtGrid(minf.x+1, minf.y) == null || getAtGrid(minf.x+1,minf.y).type == "I" && getAtGrid(minf.x+1,minf.y).direction %2 != 1) && minf.x+1 >= 0 && minf.y >= 0){
     		// move right

    		var totalDist = Math.abs(goal.x-(minf.x+1)) + Math.abs(goal.y-minf.y);    		
			var push = new node({x: minf.x+1, y: minf.y}, minf.g+1, totalDist, minf)

			if(push.parent && push.parent.parent)
    			if(push.parent.crossing && !push.parent.parent)
    				console.log(push.parent)

			if(getAtGrid(minf.x+1,minf.y) != null && getAtGrid(minf.x+1, minf.y).type == "I"){
				push.crossing = true;
			}	

			var bool = false;
			if(push.parent){
				if(getAtGrid(push.parent.x,push.parent.y))
					if(push.parent.crossing)
						if(getAtGrid(push.parent.x,push.parent.y).direction % 2 == 1)							
							bool = true;

			} 
			if(!bool)
    			successors.push(push)
	
		}

     	if((getAtGrid(minf.x-1, minf.y) == null || getAtGrid(minf.x-1,minf.y).type == "I" && getAtGrid(minf.x-1,minf.y).direction %2 != 1) && minf.x-1 >= 0 && minf.y >= 0){
	    	// move left
	    	var totalDist = Math.abs(goal.x-(minf.x-1)) + Math.abs(goal.y-minf.y);
			var push = new node({x: minf.x-1, y: minf.y}, minf.g+1, totalDist, minf)
			
			if(getAtGrid(minf.x-1,minf.y) != null && getAtGrid(minf.x-1,minf.y).type == "I"){
				push.crossing = true;
			}		    	

	    	var bool = false;
			if(push.parent){
				if(getAtGrid(push.parent.x,push.parent.y))
					if(push.parent.crossing)
						if(getAtGrid(push.parent.x,push.parent.y).direction % 2 == 1)							
							bool = true;

			} 
			if(!bool)
    			successors.push(push)  	
	    }

    	for(i = 0; i < successors.length; i++){
    		//console.log(i)
    		if(successors[i].x == goal.x && successors[i].y == goal.y){
    			//console.log("found it")
    			return successors[i]
    		}

    		found = false;
    		for(j = 0; j < closedSet.length; j++){
				if(successors[i].x == closedSet[j].x && successors[i].y == closedSet[j].y){
	    			if(closedSet[j].f < successors[i].f){
	    				//console.log(successors[i])
	    				found = true;
	    				break;
	    			}
	    		}
    		}

    		if(found)
    			continue;

    		for(k = 0; k < openSet.length; k++){
    			if(successors[i].x == openSet[k].x && successors[i].y == openSet[k].y){
	    			if(openSet[k].f < successors[i].f){
	    				found = true;
	    				break;
	    			}
	    		}
    		}

    		if(found)
    			continue;

    		if(!found)
    			openSet.push(successors[i])

    	}
    	closedSet.push(minf)

    	//console.log(openSet)
    	//console.log(minf)
    	//console.log(closedSet)
    }
}


/*
	this places the wires on the the board
*/
function printPath(start, end){

	if(start.x == end.x && start.y == end.y){
		return false;
	}


	if(arguments.length == 0){	
		start = new node({x:2, y:2}); // hard coded
		end = new node({x:3, y:2})	
	}
	z = astar(start, end);		// get the results
	updateUndoList()
	// prev is needed to keep track of the direction
	var prev = null;

	
	// case for the end of the search
	if(prev == null){

			console.log(z.x + " S " + z.y)


			var xxx = z.parent.x - z.x
			var yyy = z.parent.y - z.y

			//console.log (xxx  + " " + yyy)
			var topush = new i_wire("", z.x, z.y);


			if(xxx){
				topush.direction = 1
			} else if(yyy){
				topush.direction = 2
			}
		if(!getAtGrid(end.x, end.y))
			grid.push(topush)
	}

	// keep looping while there is still a parent
	while(z.parent != null){
		if(z.crossing){
			//console.log(z.x + " "+ z.y)
			grid.splice(grid.indexOf(getAtGrid(z.x, z.y)),1)
			grid.push(new crossing_wire("", z.x, z.y))

			prev = z;
			z = z.parent
			continue;
		}

		// this if statement is here b/c not to include the square itself
		if(prev != null){


			// xx and yy to check which way the last one was coming from direction
			var xx = prev.x - z.x 
			var yy = prev.y - z.y

			// peek into the nextone see if it needs a corner piece

				if((z.parent.x != prev.x) && (z.parent.y != prev.y)){
					
					var xxx = z.parent.x - z.x
					var yyy = z.parent.y - z.y

					//console.log (xx + " " + yy  + " " + xxx  + " " + yyy)
					var topush = new l_wire("", z.x, z.y);



					if(((yy == 1) && (xxx == -1)) || (xx == -1) && (yyy == 1)){
						topush.direction = 2
					} else if((yy == -1) && (xxx == -1) || (xx == -1) && (yyy == -1)){
						topush.direction = 3
					} else if((yy == 1) && (xxx == 1) || (xx == 1) && (yyy == 1)){
						topush.direction = 1
					} else {
						topush.direction = 0
					}



				} else{

					var topush = new i_wire("", z.x, z.y);

					if((xx == 1) || (xx == -1)){
						topush.direction = 1;
					} else if((yy == -1) || (yy == 1)){
						topush.direction = 0;
					}
				}
				grid.push(topush)
		}

		

		prev = z;
		z = z.parent
	}
	// the start

	if(z.parent == null){
		var xx = prev.x - z.x 
		var yy = prev.y - z.y
		console.log("last one")
		var topush = new i_wire("", z.x, z.y);

		if(xx)
			topush.direction = 1;
		grid.push(topush)
	}

	updateGridInterface()
}



/* path finding algo in here */

// given a component, 
//return true if on that coord square is empty. 
//return false if coord square has something you cannot traverse on
function canTraverse(comp){
	if(comp == null){
		return true;
	}
	return false;
}

// checks if currComp is in the visited list
// true if is in list
// false if not in list
function notInVisited(currComp, visited){
	for (var i = visited.length - 1; i >= 0; i--) {
		var v = visited[i];
		if(v.x == currComp.x && v.y == currComp.y){
			return true;
		}
	}
	return false;
}

function pathFind(source, dest){
	pft(dest,canTraverse(source),[],[source], []);
}

// not finished
// helper function for 
function pfh(dest, canTraverse, visited, bftList, path){
	for (var i = bftList.length - 1; i >= 0; i--) {

		var currComp = bftList[i];

		if(currComp.x == dest.x && currComp.y == dest.y){
			return path;
		}

		if(canTraverse(currComp) && notInVisited(currComp)){
		var upComp = getAtGrid(currComp.x, currComp.y-1);
		var downComp = getAtGrid(currComp.x, currComp.y+1);
		var leftComp = getAtGrid(currComp.x-1, currComp.y);
		var rightComp = getAtGrid(currComp.x+1, currComp.y);

		visited.push(currComp);

		bftList.push(upComp);
		bftList.push(downComp);
		bftList.push(leftComp);
		bftList.push(rightComp);
	}
	}
}

