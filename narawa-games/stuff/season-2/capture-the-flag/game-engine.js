var level = 3;
var imageCount = 0;
var keyPress = [];
var avatarPos = [10, 140];
var gravity = 5;
var isJumping = false;
var rockPos = [500, -100];
var counting = false;
var toCollect = 0;
var avatarFrame = 0;
var avatarSpeed = 0;
var rotation=false;
var timeScale=1;
var hitByRock=false;
var rockAlpha=1.0;
var drawOnce=true;
var timeOfDay=-1;
var canvas, animationCel, sprites, coins;
function calculate() {
	var old=new Date().getTime();
	var didCollide = false;
	for (var y = 2; y < sprites.length; y ++) {
		var spriteImage=sprites[y][0];
		var left=sprites[y][1];
		var top=sprites[y][2];
		var width=sprites[y][3];
		var height=sprites[y][4];
		if (drawOnce==true) {
			canvas.drawImage(spriteImage, 0, 0, width, height, left, top, width, height);
		}
		if ((rockPos[0] + 100 > left && rockPos[0] < left + width && rockPos[1] + 100 > top) || rockPos[1] + 100 >= 600) {
			if (rockPos[1] + 100 <600) {
				rockPos[1]=top-99;
			}
			else {
				rockPos[1]=500;
			}
			if (rockAlpha>0.05) {
				rockAlpha=rockAlpha-0.05;
			}
			else {
				rockAlpha=0;
			}
			if (counting==false) {
				counting = true;
				window.setTimeout(function () {
					rockPos = [-9999, -9999];
					window.setTimeout(function () {rockAlpha=1.0; rockPos = [Math.floor(Math.random() * 1100), -100]; counting=false;}, sprites[1]);
				}, 660);
			}
		}
		if ((avatarPos[0]+110 >= left && avatarPos[0]+20 <= left + width && avatarPos[1] + 160 > top && avatarPos[1] + 160 <= top + height) && gravity > 0 && hitByRock==false) {
			gravity = 0;
			avatarPos[1]=top-159;
			didCollide = true;
			if (spriteImage==window.coin) {
				canvas.clearRect(left, top, width, height);
				sprites.splice(y, 1);
				toCollect++;
				if (toCollect>=coins) {
					level++;
					clearInterval(window.gameLoop);
					renderLevel();
				}
			}
		}
	}
	drawOnce=false;
	if (rockPos[0] + 100 >= avatarPos[0]+20 && rockPos[0] <= avatarPos[0]+110 && rockPos[1] + 100 >= avatarPos[1]+20 && rockPos[1] <= avatarPos[1]+140 && hitByRock==false && counting==false) {
		hitByRock=true;
	}
	if (didCollide == false) {
		avatarPos[1] += gravity;
	}
	else {
		if (keyPress.indexOf("ArrowUp") >= 0) {
			isJumping = true;
			gravity = -20;
			avatarFrame = 0;
		}
	}
	if (counting==false) {
		rockPos[1] += 10;
	}
	if (keyPress.indexOf("ArrowLeft") >= 0 || keyPress.indexOf("ArrowRight") >= 0) {
		if (avatarSpeed < 10) {
			avatarSpeed = avatarSpeed + 2;
		}
		if (didCollide == true && timeScale>=2 ) {
			avatarFrame += 130;
			timeScale=0;
		}
		timeScale++;
		if (avatarFrame >= 1000) {
			avatarFrame = 0;
		}
		if (keyPress.indexOf("ArrowLeft") >= 0) {
			rotation = true;
			avatarPos[0] = avatarPos[0]-avatarSpeed;
		}
		if (keyPress.indexOf("ArrowRight") >= 0) {
			rotation = false;
			avatarPos[0] = avatarPos[0] + avatarSpeed;
		}
	}
	else {
		avatarFrame = 0;
	}
	if (gravity > 0) {
		isJumping = false;
	}
	if (gravity < 20) {
		gravity = gravity + 2;
	}
	if ((new Date().getTime()-old)*3>32) {
		alert("Error #0: Frame Rate Overflow!");
	}
	animationCel.clearAll();
	animationCel.globalAlpha=rockAlpha;
	animationCel.drawImage(window.rock, rockPos[0], rockPos[1], 100, 100);
	animationCel.globalAlpha=1.0;
	animationCel.save();
	animationCel.translate(avatarPos[0], avatarPos[1]);
	
	if (rotation == true) {
		animationCel.translate(130, 0);
		animationCel.scale(-1, 1);
	}
	animationCel.drawImage(window.player, avatarFrame, 0, 130, 160, 0, 0, 130, 160);
	animationCel.restore();
}
function start() {
	drawOnce=true;
	canvas.clearAll();
	window.gameLoop=window.setInterval(calculate, 33);
}
function resetF() {
	keyPress=[];
	toCollect=0;
	avatarPos=[10, 170];
	gravity=0;
	hitByRock=false;
}
function initKeyEvents() {
	$(window).on("keyup", releaseHandler);
	$(window).on("keydown", keyHandler);
}
function renderLevel() {
	$.get("/level?level=" + level, function (data, state) {
		resetF();
		animationCel.clearAll();
		eval("sprites = "+data);
		coins=sprites[0];
		window.saveRefresh=sprites.slice();
		timeOfDay=(timeOfDay+1)%3;
		$("#main-frame").css("background-image", "url(\"background"+timeOfDay+".jpg\")");
		canvas.drawImage(window.play, 0, 0, 1200, 600);
		$(window).off();
		$("canvas").on("click", function () {$("canvas").off(); initKeyEvents(); window.play = window.levelstart; start();});
	});
}
function loadImage() {
	imageCount ++ ;
	var toOffset = 380 + 50 * imageCount;
	canvas.strokeRect(toOffset, 375, 40, 20);
	canvas.fillRect(toOffset, 375, 40, 20);
	if (imageCount >= 9) {
		renderLevel();
	}
}
function releaseHandler (event) {
	keyPress.splice(keyPress.indexOf(event.originalEvent.getKey()), 1);
	if (event.originalEvent.getKey().indexOf("Arrow")>=0) {
		avatarSpeed=0;
	}
}
function keyHandler(event) {
	if (keyPress.indexOf(event.originalEvent.getKey()) == -1) {
		keyPress.push(event.originalEvent.getKey());
	}
	if (event.originalEvent.getKey()=="Shift") {
		$(window).off();
		clearInterval(window.gameLoop);
		resetF();
		canvas.fillRect(0, 0, 1200, 600);
		sprites=window.saveRefresh.slice();
		window.setTimeout(function () {initKeyEvents(); start();}, 200);
	}
}
$(document).ready(function () {
	/* Mozilla Fallback! */
	/* */	var query=window.location.search;
	/* */	var l=query.length;
	/* */	if (l>3) {
	/* */		level=parseInt(query.slice(3, l), 10);
	/* */	}
	/* Mozilla Fallback! */
	canvas = $("canvas")[0].getContext("2d");
	canvas.imageSmoothingEnabled = false;
	canvas.strokeStyle = "black";
	canvas.lineWidth = 6;
	canvas.textBaseline = "bottom";
	canvas.textAlign = "center";
	canvas.fillStyle = "white";
	canvas.font = "50px sans-serif";
	animationCel = $("#animation-cel")[0].getContext("2d");
	text(canvas, "Loading Image Assets...", 600, 325, 1000);
	CanvasRenderingContext2D.prototype.clearAll=function () {
		this.clearRect(0, 0, 1200, 600);
	};
	if (navigator.userAgent.indexOf("WebKit")>=0) {
		KeyboardEvent.prototype.getKey=function () {
			var retard=this.keyIdentifier;
			switch (retard) {
				case ("Up"):
					retard="ArrowUp";
					break;
				case ("Left"):
					retard="ArrowLeft";
					break;
				case ("Right"):
					retard="ArrowRight";
					break;
				default:
					break;
			}
			return retard;
		};
	}
	else {
		KeyboardEvent.prototype.getKey=function () {
			return this.key;
		};
	}
	initKeyEvents();
	initImages(["platform", "rock", "player", "coin"], "png");
	initImages(["play", "levelstart", "background2", "background1", "background0"], "jpg");
});