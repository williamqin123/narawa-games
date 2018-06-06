var key = null;
var gameLoop = null;
var tick = 0;

function keyPressed(event) {
	key = event.keyCode;
}

function keyReleased(event) {
	key = null;
}

function tick() {
	$(".sprite").each(function() {
		var ctx = this.getContext("2d");
		var frameMapping = eval(this.attr("data-frames"));
		
		var image = images[this.attr("data-image")];
		
		var width = this.attr("width");
		var height = this.attr("height");

		var frameY = eval(this.attr("data-frameY")) * height; //Specifies the Y position on the spritesheet
		var frameX = (tick % 10) * witch; //The sprite animation is 10 frames long
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(image, currentFrame[0], currentFrame[1], width, height, 0, 0, width, height);



		var spriteFunction = eval(this.attr("function"));
		spriteFunction();
	});
}

function startGame() {
	gameLoop = window.setInterval(tick, 100);
	$(window).on("keydown", keyPressed);
	$(window).on("keyup", keyReleased);
}