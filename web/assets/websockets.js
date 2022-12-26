globals = {
    userId: "",
    socket: {
        init: () => {
            let url = "wss://" + window.location.host + "/shared-whiteboard-ws";
            let socket = new WebSocket(url);

            socket.onopen = function(e) {
                console.log("[open] Connection established");

                globals.socket.addPath = (pId, str) => {
                    socket.send(JSON.stringify({
                        action: "addPath",
                        pathId: pId,
                        path: str
                    }));
                };

                globals.socket.deletePath = (uId, pId) => {
                    socket.send(JSON.stringify({
                        action: "deletePath",
                        userId: uId,
                        pathId: pId
                    }));
                };

                globals.socket.clearBoard = () => {
                    socket.send(JSON.stringify({
                        action: "clearBoard",
                    }));
                };

                globals.socket.prevBoard = () => {
                    socket.send(JSON.stringify({
                        action: "prevBoard",
                    }));
                };

                globals.socket.nextBoard = () => {
                    socket.send(JSON.stringify({
                        action: "nextBoard",
                    }));
                };
            };

            socket.onmessage = function(event) {
                let data = JSON.parse(event.data);
                switch (data.action) {
                    case "setUserId":
                        globals.setUserId(data.userId);
                        break;
                    case "addPath":
                        globals.addPath(data.pathId, data.userId, data.payload);
                        break;
                    case "deletePath":
                        globals.deletePath(data.pathId, data.userId);
                        break;
                    case "clearBoard":
                        globals.clearBoard();
                        document.getElementById("pageNr").innerHTML = data.currentLayer + 1;
                        break;
                    default:
                        console.log("[Unknown message] " + event.data);
                }
            };

            socket.onclose = function(event) {
                if (event.wasClean) {
                    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    // e.g. server process killed or network down
                    // event.code is usually 1006 in this case
                    console.log('[close] Connection died');
                }

                setTimeout(function() {
                  globals.socket.init();
                }, 100);

                globals.setUserId(""); //disable writing
            };

            socket.onerror = function(error) {
                console.log(`[error] ${error.message}`);

                globals.setUserId(""); //disable writing
                ws.close();
            };
        }
    }
}