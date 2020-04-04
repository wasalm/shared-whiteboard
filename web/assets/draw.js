var currentPath;
var userId = "";
var n = 0;

/*
 * Constants
 */

var ownColor = '#16264c';
var collaboratorColor = '#5d6200';
var selectedColor = 'blue';

/*
 *	Socket functions
 */
globals.setUserId = function(id) {
	userId = id;
}

globals.addPath = function(pId, uId, payload) {
	var path = new Path({
        strokeWidth: 1,
        strokeCap: 'round'
    });

    path.importJSON(payload);
    if(uId == userId) {
    	path.strokeColor =  ownColor;
    } else {
    	path.strokeColor =  collaboratorColor;
    }

    path.data.selected = false;
    path.data.userId = uId;
    path.data.pathId = pId;
    path.visible = true;
}

globals.deletePath = function(pId, uId) {
	for(var i=0; i < project.layers.length; i++) {
		for(var j = project.layers[i].children.length-1; j >= 0; j-- ) {
			var child = project.layers[i].children[j];
			if(child.data.userId == uId && child.data.pathId == pId) {
				child.remove();
				return;
			}
		}
	}
}

/*
 *   Eraser and pen modes
 */

var PEN_MODE = 0;
var ERASER_MODE = 1;
var mode = 0;

var mouseCircle = new Path.Circle(new Point(0, 0), 10); // By defining circle here it is not part of any layer
mouseCircle.fillColor = '#ffffffaa';
mouseCircle.visible = false;

globals.enablePen = function() {
    mode = PEN_MODE;
}

globals.enableEraser = function() {
    mode = ERASER_MODE;
}

function deselectAllPaths() {
    for(var i =0; i< project.activeLayer.children.length; i++) {
        var child = project.activeLayer.children[i];
        child.data.selected = false;
    }
}

function selectPaths(pt) {
    for(var i =0; i< project.activeLayer.children.length; i++) {
        var child = project.activeLayer.children[i];
        if(!child.data.selected) {
            if(child.intersects(mouseCircle)) {
                child.data.selected = true;
                child.strokeColor = selectedColor;
            }
        }
    }
}

function deleteSelectedPaths() {
    var len = project.activeLayer.children.length;
    for(var i=len-1; i >= 0; i--) {
        var child = project.activeLayer.children[i];
        if(child.data.selected) {
        	globals.socket.deletePath(child.data.userId, child.data.pathId);
            child.remove();
        }
    }
}

/*
 * Multiple boards
 */
new Layer();

/*
 * Clear Board
 */

globals.clearBoard = function() {
    project.activeLayer.removeChildren();
}

/*
 * Mouse events
 */
function onMouseDown(event) {
	if(userId == "") { return; }

    if(mode == PEN_MODE) {
        currentPath = new Path({
            segments: [event.point],
            strokeColor: ownColor, //rgb(0, 151, 212),
            strokeWidth: 1,
            strokeCap: 'round'
        });

        currentPath.data = {
        	selected: false,
        	userId: userId,
        	pathId: makeid()
        };
    } else {
        deselectAllPaths();
        selectPaths(event.point);

        mouseCircle.position = event.point;
        mouseCircle.visible = true;
    }  
}

function onMouseDrag(event) {
	if(userId == "") { return; }

    if(mode == PEN_MODE) {
        currentPath.add(event.point);    
    } else {
        selectPaths(event.point);
        mouseCircle.position = event.point;
        mouseCircle.scale((60+event.delta.length*3)/mouseCircle.length);
    }
}

function onMouseUp(event) {
	if(userId == "") { return; }

    if(mode == PEN_MODE) { 
        currentPath.simplify(10);
        var copy = currentPath.clone({insert: false});
        copy.data = {};
        globals.socket.addPath(currentPath.data.pathId, copy.exportJSON());
    } else {
        selectPaths(event.point);
        deleteSelectedPaths();
        mouseCircle.visible = false;
    }
}

function makeid() {
    var result = n + 'y';
    n++;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

globals.socket.init();