setTimeout(ts, 1000);

function toggleFullScreen() {
	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} 
		else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} 
		else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} 
	else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} 
		else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} 
		else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}

function ts(){
	var elem = document.body;
	if (elem.requestFullscreen) {
			elem.requestFullscreen();
	} 
	else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
	} 
	else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
	}
}
