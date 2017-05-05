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

