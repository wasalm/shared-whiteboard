const WebSocket = require('ws');

let n = 0;
let layers = [{}];
let currentLayer = 0;

function makeid() {
    var result = n + 'x';
    n++;
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function broadcast(socket, source, payload) {
    wss.clients.forEach(function each(client) {
        if (client !== source && client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

const wss = new WebSocket.Server({ port: 8081 });
wss.on('connection', function(ws) {
    let userId = makeid();

    ws.send(JSON.stringify({
        action: "setUserId",
        userId: userId
    }));

    for (var uId in layers[currentLayer]) {
        if (layers[currentLayer].hasOwnProperty(uId)) {
            for (var pId in layers[currentLayer][uId]) {
                if (layers[currentLayer][uId].hasOwnProperty(pId)) {
                    ws.send(JSON.stringify({
                        action: "addPath",
                        userId: uId,
                        pathId: pId,
                        payload: layers[currentLayer][uId][pId]
                    }));
                }
            }
        }
    }

    ws.on('message', function incoming(payload) {
        let data = JSON.parse(payload);

        switch (data.action) {
            case 'prevBoard':
                if (currentLayer != 0) { // ignore if zero
                    //Request clients to clean boards
                    broadcast(wss, null, JSON.stringify({
                        action: "clearBoard"
                    }));

                    if (currentLayer + 1 == layers.length) {
                        // Last layer
                        if (Object.keys(layers[currentLayer]).length == 0) {
                            //Empty Board, delete
                            layers.splice(currentLayer, 1);
                        }
                    }

                    // Go back one layer
                    currentLayer--;

                    //Send board contents
                    for (var uId in layers[currentLayer]) {
                        if (layers[currentLayer].hasOwnProperty(uId)) {
                            for (var pId in layers[currentLayer][uId]) {
                                if (layers[currentLayer][uId].hasOwnProperty(pId)) {
                                    broadcast(wss, null, JSON.stringify({
                                        action: "addPath",
                                        userId: uId,
                                        pathId: pId,
                                        payload: layers[currentLayer][uId][pId]
                                    }));
                                }
                            }
                        }
                    }
                }
                break;
            case 'nextBoard':
                //Request clients to clean boards
                if (Object.keys(layers[currentLayer]).length != 0 || currentLayer + 1 < layers.length) {
                    broadcast(wss, null, JSON.stringify({
                        action: "clearBoard"
                    }));

                    //create layer if nessesary
                    if (currentLayer + 1 == layers.length) {
                        //create new 
                        layers.push({});
                    }

                    // Go forward one layer
                    currentLayer++;

                    //Send board contents
                    for (var uId in layers[currentLayer]) {
                        if (layers[currentLayer].hasOwnProperty(uId)) {
                            for (var pId in layers[currentLayer][uId]) {
                                if (layers[currentLayer][uId].hasOwnProperty(pId)) {
                                    broadcast(wss, null, JSON.stringify({
                                        action: "addPath",
                                        userId: uId,
                                        pathId: pId,
                                        payload: layers[currentLayer][uId][pId]
                                    }));
                                }
                            }
                        }
                    }
                }
                break;
            case 'addPath':
                if (typeof layers[currentLayer][userId] == "undefined") {
                    layers[currentLayer][userId] = {};
                }

                layers[currentLayer][userId][data.pathId] = data.path;

                broadcast(wss, ws, JSON.stringify({
                    action: "addPath",
                    userId: userId,
                    pathId: data.pathId,
                    payload: data.path
                }));
                break;
            case 'deletePath':
                if (typeof layers[currentLayer][data.userId] != "undefined") {
                    if (typeof layers[currentLayer][data.userId][data.pathId] != "undefined") {
                        delete layers[currentLayer][data.userId][data.pathId];
                    }

                    if (Object.keys(layers[currentLayer][data.userId]).length == 0) {
                        delete layers[currentLayer][data.userId];
                    }
                }

                broadcast(wss, ws, JSON.stringify({
                    action: "deletePath",
                    userId: data.userId,
                    pathId: data.pathId
                }));
                break;
            case 'clearBoard':
                layers[currentLayer] = {};

                broadcast(wss, ws, JSON.stringify({
                    action: "clearBoard"
                }));
                break;
            default:
                console.log(data);
        }
    });
});