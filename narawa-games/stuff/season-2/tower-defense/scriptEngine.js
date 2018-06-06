var ctx, selectedTowerBuyCost, canvas, lose;
var money=10;
var imageLoadCount=0;
var selectedTowerCursor=null;
var robotXPosition=[];
var robotYPosition=[];
var towerXPosition=[];
var towerYPosition=[];
var robotshealth=[];
var levelEnemyCount=5;
var specificRobotAnimationFrame=[];
var specificRobotImage=[];
var gobalTowerAnimationFrame=0;
var specificTowerImage=[];
var globalRobotHeath=9;
var cursorXPosition=0;
var cursorYPosition=0;
var clientbounder;
function updateMoneyLabel() {
	$("#money").html("Money: $"+money+".00");
}
function killSpecificRobot(loopCount) {
	specificRobotAnimationFrame[loopCount]=0;
	specificRobotImage[loopCount]=window.explosionAnimationSprite;
	money=money+1;
	updateMoneyLabel();
}
function end() {
	ctx.save();
	ctx.fillStyle="black";
	ctx.globalAlpha=0.5;
	ctx.fillRect(0, 0, 1200, 600);
	ctx.restore();
	ctx.drawText("You're Outta Money!", 325, 80);
	ctx.drawText("Click to Replay!", 425, 50);
	canvas.off();
	canvas.on("click", function () {window.location.reload(false);});
}
function start() {
	window.loop=window.setInterval(draw, 50);
}
function addSelectedTower(event) {
	if (money>=selectedTowerBuyCost) {
		specificTowerImage.push(selectedTowerCursor);
		towerXPosition.push(cursorXPosition-120);
		towerYPosition.push(cursorYPosition-120);
		money=money-selectedTowerBuyCost;
		updateMoneyLabel();
	}
	selectedTowerCursor=null;
	selectedTowerBuyCost=null;
	var closureIndex=towerXPosition.length-1;
	window.setTimeout(function () {
		towerXPosition[closureIndex]=-9999;
	}, 20000);
}
function spawnNewEnemies(sup) {
	globalRobotHeath++;
	if (sup=="yo") {
		window.clearInterval(window.loop);
	}
	for (var x=0; x<levelEnemyCount; x++) {
		robotXPosition[x]=1200;
		robotYPosition[x]=Math.floor(Math.random()*520);
		robotshealth[x]=globalRobotHeath;
		specificRobotAnimationFrame[x]=0;
		specificRobotImage[x]=window.robotAnimationSprite;
	}
	for (var y=0; y<towerXPosition.length; y++) {
		if (towerXPosition[y]<=-9998) {
			specificTowerImage.splice(y, 1);
			towerXPosition.splice(y, 1);
			towerYPosition.splice(y, 1);
		}
	}
	start(); 
}
function draw() {
	ctx.clearRect(0, 0, 1200, 600);
	gobalTowerAnimationFrame=(gobalTowerAnimationFrame+240)%2400;
	for (var t=0; t<towerXPosition.length; t++) {
		ctx.drawImage(specificTowerImage[t], gobalTowerAnimationFrame, 0, 240, 240, towerXPosition[t], towerYPosition[t], 240, 240);
	}
	var deadRobots=0;
	for (var robotLoopIteration=0; robotLoopIteration<levelEnemyCount; robotLoopIteration++) {
		// For each robot, it'll check each tower for...
		for (var tower=0; tower<towerXPosition.length; tower++) {
			// If the robots get shot...
			if (towerXPosition[tower]+240>robotXPosition[robotLoopIteration] && towerXPosition[tower]<robotXPosition[robotLoopIteration]+80) {
				if (towerYPosition[tower]+240>robotYPosition[robotLoopIteration] && towerYPosition[tower]<robotYPosition[robotLoopIteration]+80) {
					if (robotYPosition[robotLoopIteration]+40>towerYPosition[tower]+120 && robotYPosition[robotLoopIteration]<520) {
						robotYPosition[robotLoopIteration]=robotYPosition[robotLoopIteration]+5;
					}
					if (robotYPosition[robotLoopIteration]+40<towerYPosition[tower]+120 && robotYPosition[robotLoopIteration]>0) {
						robotYPosition[robotLoopIteration]=robotYPosition[robotLoopIteration]-5;
					}
					robotshealth[robotLoopIteration]=robotshealth[robotLoopIteration]-1;
					break;
				}
			}
		}
		// Mobot robots...
		robotXPosition[robotLoopIteration]=robotXPosition[robotLoopIteration]-5;
		// Animate robots...
		if (specificRobotImage[robotLoopIteration]==window.explosionAnimationSprite && specificRobotAnimationFrame[robotLoopIteration]>=640) {
			specificRobotImage[robotLoopIteration]=window.blank;
		}
		if (specificRobotImage[robotLoopIteration]!=window.blank) {
			specificRobotAnimationFrame[robotLoopIteration]=(specificRobotAnimationFrame[robotLoopIteration]+80)%720;
		}
		else {
			deadRobots++;
		}
		if (robotXPosition[robotLoopIteration]<-80 && specificRobotImage[robotLoopIteration]==window.robotAnimationSprite) {
			killSpecificRobot(robotLoopIteration);
			money=money-3;
			updateMoneyLabel();
		}
		ctx.drawImage(specificRobotImage[robotLoopIteration], specificRobotAnimationFrame[robotLoopIteration], 0, 80, 80, robotXPosition[robotLoopIteration], robotYPosition[robotLoopIteration], 80, 80);
		if (robotshealth[robotLoopIteration]<=0 && specificRobotImage[robotLoopIteration]==window.robotAnimationSprite) {
			killSpecificRobot(robotLoopIteration);
		}
	}
	if (selectedTowerCursor!=null) {
		ctx.drawImage(selectedTowerCursor, 0, 0, 240, 240, cursorXPosition-120, cursorYPosition-120, 240, 240);
	}
	if (money<=0) {
		money=0;
		lose="yeah";
		updateMoneyLabel();
		end();
		window.clearInterval(window.loop);
	}
	ctx.drawText("Level (Stage): #"+(globalRobotHeath-9), 60, 50);
	if (deadRobots>=levelEnemyCount && lose!="yeah") {
		spawnNewEnemies("yo");
	}
}
function loadImage() {
	imageLoadCount++;
	if (imageLoadCount>=8) {
		imageRefresh();
		ctx.drawImage(window.startPanel, 0, 0, 1200, 600);
		canvas.on("click", function () {
			canvas.off();
			canvas.on("click", addSelectedTower);
			spawnNewEnemies("");
		});
	}
}
$(document).ready(function () {
	canvas=$("canvas");
	ctx=canvas[0].getContext("2d");
	initCustom();

	ctx.textBaseLine="bottom";
	ctx.textAlign="center";
	ctx.lineWidth=6;
	ctx.strokeStyle="black";
	ctx.drawText("Preparing For Battle...", 325, 80);
	ctx.lineJoin="bevel";
	ctx.imageSmoothingEnabled=false;
	clientbounder=canvas[0].getBoundingClientRect().left;

	$(window).on("mousemove", function (event) {
		cursorXPosition=event.clientX-parseInt(clientbounder);
		cursorYPosition=event.clientY;
	});
	$("section img").on("click", function (event) {
		selectedTowerCursor=eval("window."+event.target.id.substring(event.target.id.lastIndexOf("/")+1));
		selectedTowerBuyCost=parseInt(event.target.title);
	});
});