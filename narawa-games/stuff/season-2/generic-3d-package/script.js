var obstacles=[[-9999, 100], [-9999, 170], [-9999, 275], [-9999, 445]];
var trees=[[850, 70], [850, 120], [850, 205], [850, 355], [850, 585]];
var loadedImageCount=0;
var keyPress=null;
var skaterPosition=0;
var score=0;
var skaterFrame=0;
var gameOver=false;
var cycle=2;
function lose() {
	gameOver=true;
	window.canvas.save();
	window.canvas.fillStyle="black";
	window.canvas.globalAlpha=0.75;
	window.canvas.fillRect(0, 0, 1000, 600)
	window.canvas.restore();
	window.canvas.textAlign="center";
	window.canvas.drawText("Final Score: "+score+"!", 170, 72);
	window.canvas.drawText("You skated into a hole!", 240, 48);
	window.canvas.drawText("Click anywhere to replay the game!", 500, 36);
	$("canvas").on("click", function () {window.location.reload(false);});
	clearInterval(window.gameLoop);
}
function draw() {
	window.canvas.clearRect(0, 0, 1000, 600);
	if (window.loadChecker!=null) {
		clearInterval(window.loadChecker);
		window.loadChecker=null;
	}
	if (skaterFrame>=2000) {
		skaterFrame=0;
	}
	score++;
	var scoreDisplay="Score: "+score;
	window.canvas.drawText(scoreDisplay, 60, 50);
	if (keyPress=="37" && skaterPosition<300) {
		skaterPosition+=15;
	}
	if (keyPress=="39" && skaterPosition>-300) {
		skaterPosition=skaterPosition-15;
	}
	for (x=0; x<obstacles.length; x++) {
		obstacles[x][1]=obstacles[x][1]*1.025;
		var divide=600/obstacles[x][1];
		var divWidth=300/divide;
		var obstacleX=(500-divWidth/2)-obstacles[x][0]/divide;
		var divHeight=200/divide;
		var obstacleY=obstacles[x][1];
		var realSkatePos=450-skaterPosition;
		var divOffset=divWidth/3;
		var divTippy=divHeight/3;
		if (collide(realSkatePos, 500, 100, 0, obstacleX+divOffset, obstacleY+divTippy, divWidth-divOffset*2, divHeight-divTippy*2)==true) {
			lose();
		}
		if (gameOver==false) {
			window.canvas.drawImage(window.obstacle, obstacleX, obstacleY, divWidth, divHeight);
			if (obstacles[x][1]>=600) {
				obstacles.splice(obstacles.length-1, 1);
				obstacles.splice(0, 0, [Math.floor(Math.random()*700)-350, 100]);
			}
			trees[x][1]=trees[x][1]*1.025;
			var treeDiv=600/trees[x][1];
			var treeWidth=400/treeDiv;
			var treeX=(500-treeWidth/2)-trees[x][0]/treeDiv;
			var treeHeight=400/treeDiv;
			var treeY=trees[x][1];
			var negTreeX=(500-treeWidth/2)+trees[x][0]/treeDiv;
			window.canvas.drawImage(window.tree, treeX, treeY, treeWidth, treeHeight);
			window.canvas.drawImage(window.tree, negTreeX, treeY, treeWidth, treeHeight);
			if (trees[x][1]>=600) {
				trees.splice(trees.length-1, 1);
				trees.splice(0, 0, [850, 70]);
			}
		}
	}
	if (gameOver==false) {
		window.canvas.drawImage(window.skater, skaterFrame, 0, 100, 200, realSkatePos, 300, 100, 200);
	}
	if (cycle==2) {
		cycle=1;
	}
	else if (cycle==1) {
		skaterFrame+=100;
		cycle=2;
	}
}
function loadImgChecker() {
	if (loadedImageCount>=5) {
		$(window).on("keydown", function (event) {keyPress=event.keyCode;});
		$(window).on("keyup", function (event) {
			if (keyPress==event.keyCode) {
				keyPress=null;
			}
		});
		window.gameLoop=setInterval(draw, 50);
	}
}
function loadImage() {
	loadedImageCount++;
}
$(document).ready(function () {
	window.canvas=$("canvas")[0].getContext("2d");
	window.canvas.imageSmoothingEnabled=false;
	window.canvas.fillStyle="white";
	window.canvas.strokeStyle="black";
	window.canvas.textBaseline="bottom";
	window.canvas.lineWidth=6;
	initImages(["tree", "skater", "obstacle"], "png");
	initImages(["startImg", "bg"], "jpg");
	window.canvas.textAlign="center";
	if (window.location.search.indexOf("dsrn")>=0) {
		initImages(["dinosaur"], "png");
		window.skater=window.dinosaur;
	}
	$("canvas").on("click", function () {
		$("canvas").off();
		$("canvas")[0].style.backgroundImage="url('bg.jpg')";
		window.canvas.drawText("Loading Graphics", 400, 50);
		window.loadChecker=setInterval(loadImgChecker, 500);
	});
});