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
	document.getElementById("penBtn").classList.add("active");
	document.getElementById("eraserBtn").classList.remove("active");
});

document.getElementById("eraserBtn").addEventListener("click", (ev) => {
	globals.enableEraser();
	document.getElementById("penBtn").classList.remove("active");
	document.getElementById("eraserBtn").classList.add("active");
});