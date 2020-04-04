document.getElementById("fullscreenBtn").addEventListener("click", (ev) => {

	let btn = document.getElementById("fullscreenBtn");
	if(btn.classList.contains("fa-expand-arrows-alt")) {
		const rfs = document.body.requestFullscreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.msRequestFullscreen;
		rfs.call(document.body);
		btn.classList.remove("fa-expand-arrows-alt");
		btn.classList.add("fa-compress-arrows-alt");
	} else {
		const rfs = document.exitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen || document.msExitFullscreen;
		btn.classList.add("fa-expand-arrows-alt");
		btn.classList.remove("fa-compress-arrows-alt");
		rfs.call(rfs);
	}
});

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