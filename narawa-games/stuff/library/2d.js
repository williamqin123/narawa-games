function tileCollision(x, y) {
	var tileX = Math.floor(x / mandantory.tileSize);
	var tileY = Math.floor(y / mandantory.tileSize);
	if (mandantory.tiles[tileX][tileY] != "blank") {
		return true; // The player has hit a collidable object.
	}
	else {
		return false; // The player can keep going.
	}
}
// WORK IN PROGRESS