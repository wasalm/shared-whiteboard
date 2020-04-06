document.getElementById("prevBoardBtn").addEventListener("click", (ev) => {
	globals.socket.prevBoard();
});

document.getElementById("nextBoardBtn").addEventListener("click", (ev) => {
	globals.socket.nextBoard();
});

document.getElementById("clearBoardBtn").addEventListener("click", (ev) => {
	globals.clearBoard();
	globals.socket.clearBoard();
});

document.getElementById("penBtn").addEventListener("click", (ev) => {
	globals.enablePen();
});

document.getElementById("eraserBtn").addEventListener("click", (ev) => {
	globals.enableEraser();
});