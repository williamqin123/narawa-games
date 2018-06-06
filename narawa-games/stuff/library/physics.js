function rand(from, to) {
	return Math.ceil(Math.random()*to)-(from+1);
}
function random(from, to) {
	return rand(from, to);
}
function rect(ctsdf, a, b, c, d) {
	ctsdf.strokeRect(a, b, c, d);
	ctsdf.fillRect(a, b, c, d);
}
function collide(x, y, w, h, c, u, e, j) {
	if (x+w>c && x<c+e) {
		if (y+h>u && y<u+e) {
			return true;
		}
		return false;
	}
	return false;
}
function text(c, t, x, y, l) {
	c.strokeText(t, x, y, l);
	c.fillText(t, x, y, l);
}
function initImages(images, type) {
	for (var x = 0; x < images.length; x ++) {
		eval("window." + images[x] + " = new Image()");
		eval("window." + images[x] + ".onload = loadImage");
		eval("window." + images[x] + ".src = \"" + images[x] + "." + type + "\"");
	}
}
CanvasRenderingContext2D.prototype.drawText=function(drawText, topLevel, fontSize) {
	var gradient=this.createLinearGradient(0, topLevel-fontSize, 0, topLevel);
	gradient.addColorStop(0, "yellow");
	gradient.addColorStop(1, "orangered");
	this.fillStyle=gradient;
	this.font="bold "+fontSize+"px Roboto";
	var center=$("canvas")[0].width/2;
	this.strokeText(drawText, center, topLevel, center*1.5);
	this.fillText(drawText, center, topLevel, center*1.5);
}
$(document).ready(function () {
	$("audio").on("volumechange", function (event) {
		event.preventDefault();
		event.target.volume=1.0;
	});
});