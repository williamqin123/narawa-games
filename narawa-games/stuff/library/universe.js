//OBSOLETE!
var game={
	frameRate: 30,
	w: 1200,
	h: 700,
	type: "interval",
	ctx: {topID: null},
	eventLayer: null,
	functionName: null,
	timeoutInit: function () {
		game.tick=window.setTimeout(game.functionName, game.frameRate);
	},
	startUp: function () {
		game.ctx.topID.drawImage(images.panelName, 0, 0, game.w, game.h);
		NGdebug(images.panelName);
		game.eventLayer.on("click", function () {
			game.eventLayer.off();
			switch (game.type) {
				case ("interval"):
					game.tick=window.setInterval(game.functionName, game.frameRate);
					break;
				case ("timeout"):
					game.timeoutInit();
					break;
			}
		});
	}
}
//CURRENT!
var images={
	progress: 0,
	total: 0,
	panelName: null,
	loadFunction: function () {
		images.progress++;
		if (images.progress>=images.total) {
			game.startUp();
		}
	}
};
function randomInt(from, to) {
	return Math.ceil(Math.random()*(to-from+1))+from-1;
}
function NGexponent(num, power) {
	var result=num;
	for (var n=1; n<power; n++) {
		result*=num;
	}
	return result;
}
function makeImage() {
	for (var x=0, y=arguments.length; x<y; x++) {
		var name=arguments[x];
		var imageObject=new Image();
		imageObject.onload=images.loadFunction;
		imageObject.src=name;
		images[name.slice(0, name.length-4)]=imageObject;
	}
}
function antialiasing() {
	game.ctx.topID.imageSmoothingEnabled=false;
}
function NGdebug() {
	var logString="";
	for (var x=0, y=arguments.length; x<y; x++) {
		logString+=arguments[x];
		logString+=", ";
	}
	var str=logString.slice(0, logString.length-2);
	if (typeof console!="undefined") {
		console.log(str);
	}
	else {
		window.alert(str);
	}
}
function render(image, cropLeft, cropTop, cropWidth, cropHeight, width, height, left, top) {
	engine.context.drawImage(image, cropLeft, cropTop, cropWidth, cropHeight, width, height, left, top);
}
function draw(image, left, top, width, height) {
	render(image, 0, 0, width, height, left, top, width, height);
}
function draw(image, left, top, width, height, cropLeft, cropTop, cropWidth, cropHeight) {
	render(image, cropLeft, cropTop, cropWidth, cropHeight, left, top, width, height);
}
function findLineLength(xHeight, yHeight) {
	return sqrt(Math.pow(xHeight, 2)*Math.pow(yHeight, 2));
}