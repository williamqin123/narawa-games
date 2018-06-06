function getTile(x, y) {
	return tiles[x][y];
}
function getTileFromCoords(x, y) {
	var indices = getTileIndex(x, y);
	return getTile(indices.x, indices.y);
}
function getTileIndex(x, y) {
	var tileX = Math.floor(x / tileSize);
	var tileY = Math.floor(y / tileSize);
	return {x : tileX, y : tileY};
}
function isTileOccupied(x, y) {
	if (getTile(x, y) != "blank") {
		return true;
	}
}
function isTileOccupiedByProperty(x, y, property, value) {
	if (getTile(x, y).property == value) {
		return true;
	}
}
function getPlayerPositions() {
	var x = objects.avatar.position.x;
	var y = objects.avatar.position.y;
	var halfWidth = objects.avatar.size.x / 2;
	var halfHeight = objects.avatar.size.y / 2;
	var positions = {
		topLeft : [x - halfWidth, y - halfHeight],
		topRight : [x + halfWidth, y - halfHeight],
		bottomLeft : [x - halfWidth, y + halfHeight],
		bottomRight : [x + halfWidth, y + halfHeight],
		middle : [x, y]
	};
	return positions;
}
function movePlayer(direction) {
	var speed = objects.avatar.speed;
	switch (direction) {
		case ("left"):
			objects.avatar.position.x -= speed;
			break;
		case ("right"):
			objects.avatar.position.x += speed;
			break;
		case ("up"):
			objects.avatar.position.y -= speed;
			break;
		case ("down"):
			objects.avatar.position.y += speed;
			break;
	}
}