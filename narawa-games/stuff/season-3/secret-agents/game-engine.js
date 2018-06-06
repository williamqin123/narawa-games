var images={}; //This object stores all the image files we need for the game!
var objects={
	player: {
		image: null,
		position: [[0, 0], [100, 100]],
		movement: [0, 0],
		movementSpeedAlgorithm: {
			steps: [0, 1, 1, 2, 3, 5, 7, 8, 9, 9, 10, 10],
			animationFrame: 0,
			direction: 0
		},
		movementSpeed: function() {
			var tick=objects.player.movementSpeedAlgorithm.animationFrame;
			if ((tick<=10 && playerMovementDirection>0) || (tick>=1 && playerMovementDirection<0)) {
				objects.player.movementSpeedAlgorithm.animationFrame+=playerMovementDirection;
			}
			return objects.player.movementSpeedAlgorithm.steps[objects.player.movementSpeedAlgorithm.animationFrame];
		},
		size: [100, 100],
		spritePosition: [0, 0]
	},
	enemies: {
		image: null,
		positions: [0, 0]
	},
	barriers: {
		//positions: [
		//	[[200, 200], [400, 400]],
		//	[[600, 100], [1000, 300]]
		//]
	}
}; //This object contains all the information for every item in the game!
//The variables below are used to shorten the lengthy reference names for less typing!
var playerPosition=objects.player.position;
var playerWidth=objects.player.size[0];
var playerHeight=objects.player.size[1];
var playerMovementDirection=0;

var interaction={
	key: 0,
	move: function(step, action) {
		switch (action) {
			case (37):
				objects.player.movement=[-objects.player.movementSpeed(step), 0];
				break;
			case (38):
				objects.player.movement=[0, -objects.player.movementSpeed(step)];
				break;
			case (40):
				objects.player.movement=[0, objects.player.movementSpeed(step)];
				break;
			case (39):
				objects.player.movement=[objects.player.movementSpeed(step), 0];
				break;
		}
	},
	setKey: function(input) {
		interaction.key=input.keyCode;
	},
	keyPress: function(event) {
		event.preventDefault();
		playerMovementDirection=1;
		interaction.setKey(event);
	},
	keyRelease: function(event) {
		playerMovementDirection=-1;
		interaction.setKey(event);
	}
}; //This object contains all the stuff we need for user interaction!
var graphics={
	canvas: null,
	context: null,
	update: function() { //This function calculates the positions of the sprites and such!
		objects.player.movementSpeedAlgorithm.direction=playerMovementDirection;
		var barrierPositions=objects.barriers.positions;
		var collision=game.collisionDetection(barrierPositions);
		interaction.move(playerMovementDirection, interaction.key);
		if ((collision=="left" && objects.player.movement[0]<=-1) || (collision=="right" && objects.player.movement[0]>=1) || (collision=="bottom" && objects.player.movement[1]>=1) || (collision=="top" && objects.player.movement[1]<=-1)) {
			objects.player.movement=[0, 0];
		}
		//Arrays are live varibles in JavaScript!
		game.frame.offset[0]=game.frame.offset[0]-objects.player.movement[0];
		game.frame.offset[1]=game.frame.offset[1]-objects.player.movement[1]
		playerPosition[0][0]=-game.frame.offset[0]+game.frame.width/2-playerWidth/2;
		playerPosition[0][1]=-game.frame.offset[1]+game.frame.height/2-playerHeight/2;
		playerPosition[1][0]=playerPosition[0][0]+objects.player.size[0];
		playerPosition[1][1]=playerPosition[0][1]+objects.player.size[1];
	},
	draw: function() { //This function renders everything on the screen!
		graphics.context.clearRect(0, 0, game.frame.width, game.frame.height);
		var map=images["environmentMap.png"];
		graphics.context.drawImage(map, game.frame.offset[0], game.frame.offset[1], map.naturalWidth, map.naturalHeight);
		graphics.context.drawImage(images["mainCharacter.png"], objects.player.spritePosition[0],  objects.player.spritePosition[0], objects.player.size[0], objects.player.size[1], game.frame.width/2-playerWidth/2, game.frame.height/2-playerHeight/2, objects.player.size[0], objects.player.size[1]);
	},
	call: function() {
		graphics.update();
		graphics.draw();
		graphics.loop=window.setTimeout(graphics.call, 33);
	} //For the sake of simplicity, this function is a wrapper for both the update and the draw function!
};
var game={
	frame: {
		width: null,
		height: null,
		offset: [0, 0]
	},
	collisionDetection: function(objectCollection) {
		for (var i=0; i<objectCollection.length; i++) {
			if (playerPosition[0][0]<objectCollection[i][1][0] && playerPosition[1][0]>objectCollection[i][0][0] && playerPosition[0][1]<objectCollection[i][1][1] && playerPosition[1][1]>objectCollection[i][0][1]) {
				var objectWidth=objectCollection[i][1][0]-objectCollection[i][0][0];
				var objectHeight=objectCollection[i][1][1]-objectCollection[i][0][1];
				var left=playerPosition[0][0]-objectCollection[i][0][0];
				if (left>objectWidth-15) {
					return "left";
				}
				var right=objectCollection[i][1][0]-playerPosition[1][0];
				if (right>objectWidth-15) {
					return "right";
				}
				var top=playerPosition[0][1]-objectCollection[i][0][1];
				if (top>objectHeight-15) {
					return "top";
				}
				var bottom=objectCollection[i][1][1]-playerPosition[1][1];
				if (bottom>objectHeight-15) {
					return "bottom";
				}
			}
		}
	},
	imageLoadCounter: {loaded: 0, available: 0, finished: false},
	startGame: function() {
		graphics.call();
	},
	imageReady: function(imageObject, name) {
		images[name]=imageObject;
		game.imageLoadCounter.loaded+=1;
		if (game.imageLoadCounter.loaded>=game.imageLoadCounter.available && game.imageLoadCounter.finished==true) {
			game.loadDynamicData();
		}
	},
	loadImage: function(filename) {
		game.imageLoadCounter.available+=1;
		var image=new Image();
		image.onload=function() {
			var file=image;
			game.imageReady(file, filename);
		};
		image.src="images/"+filename;
	},
	loadDynamicData: function() { //This function requests level data from a JSON file!
		$.ajax({
			statusCode: {
				400: function() {
					window.alert("The game engine encountered an error while rendering the map data. Close this message to reload.");
				},
				500: function() {
					window.alert("The web server encountered an error while fetching the map data. Close this message to reload.");
				}
			},
			url: "levels/level-data.json",
			method: "GET",
			beforeSend: function(request) {
				request.overrideMimeType("text/plain; charset=UTF-8");
			},
			success: function (data) {
				var entities=JSON.parse(data);
				objects.barriers.positions=entities["barriers"]["positions"];
				game.startGame();
			},
			error: function () {
				game.loadDynamicData();
			}
		});
	}
}; //This object contains everything related to the base code of the game itself!
$(document).ready(function() {
	//game.loadImage("securityGuard.png");
	game.loadImage("mainCharacter.png");
	game.loadImage("environmentMap.png");
	game.imageLoadCounter.finished=true;
	graphics.canvas=$("canvas");
	game.frame.width=graphics.canvas.attr("width");
	game.frame.height=graphics.canvas.attr("height");
	graphics.context=graphics.canvas[0].getContext("2d");
	$(window).on("keydown", interaction.keyPress);
	$(window).on("keyup", interaction.keyRelease);
}); //This is a function that runs when the page loads!