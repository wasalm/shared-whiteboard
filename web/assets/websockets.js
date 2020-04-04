globals = {
    userId: "",
    socket: {
        init: () => {
            // let url = "ws://localhost:8081/api";
            let url = "ws://192.168.2.89:8081/api";
            let socket = new WebSocket(url);

            socket.onopen = function(e) {
                console.log("[open] Connection established");

                globals.socket = {
                    addPath: (pId, str) => {
                        socket.send(JSON.stringify({
                            action: "addPath",
                            pathId: pId,
                            path: str
                        }));
                    },

                    deletePath: (uId, pId) => {
                        socket.send(JSON.stringify({
                            action: "deletePath",
                            userId: uId,
                            pathId: pId
                        }));
                    },

                    clearBoard: () => {
                        socket.send(JSON.stringify({
                            action: "clearBoard",
                        }));
                    },

                    prevBoard: () => {
                        socket.send(JSON.stringify({
                            action: "prevBoard",
                        }));
                    },

                    nextBoard: () => {
                        socket.send(JSON.stringify({
                            action: "nextBoard",
                        }));
                    },
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
                        break;
                    default:
                        console.log("[Unknown message] " + event.data);
                }
            };

            socket.onclose = function(event) {
                if (event.wasClean) {
                    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    // e.g. server process killed or network down
                    // event.code is usually 1006 in this case
                    alert('[close] Connection died');
                }
            };

            socket.onerror = function(error) {
                alert(`[error] ${error.message}`);
            };
        }
    }
}