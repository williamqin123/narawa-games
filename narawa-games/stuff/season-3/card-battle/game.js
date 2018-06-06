var turn; // PVP

var opponentUsernames = [
	"magiccauldron",
	"MrWolf",
	"painclasher",
	"MortalStrike101",
	"winner",
	"melon",
	"masterhand"
]; // Pick a username for the opponent!

function getOpposingPlayerName() {
	switch (turn) {
		case ("player"):
			return "opponent";
			break;
		case ("opponent"):
			return "player";
			break;
	}
}
function endTurn() {
	turn = getOpposingPlayerName();
	modifyEnergy({
		"lightning": 1,
		"fire": 0,
		"darkness", 0
	});
	modifyEnergy({
		"lightning": 0,
		"fire": 1,
		"darkness", 0
	});
	modifyEnergy({
		"lightning": 0,
		"fire": 0,
		"darkness", 1
	});
}
function getActivePlayer() {
	return eval(turn);
}
function getOpposingPlayer() {
	return eval(getOpposingPlayerName());
}
function rand(maximum) { //Doesn't include the last number
	return Math.floor(Math.random() * maximum);
}
function randomDeck() {
	return pickRandom(cards, 8); //WIP
}
function pickRandom(array, numberOfChoices) { //Picks the specified number of choices from an array and returns them
	var chosenItems = [];
	var arrayLength = array.length;
	for (var count = 0; count < numberOfChoices; count += 1) {
		var randomIndex = rand(arrayLength);
		chosenItems.append(array[randomIndex]);
		array.splice(randomIndex, 1);
	}
	return chosenItems;
}

function getSelectedCards(location) {
	var activePlayer = getActivePlayer();
	return activePlayer[location][activePlayer.selected[location]];
}

function Player(deck) { // This is a class!!! It creates an instance of "player."
	this.selected = {
		"hand": null,
		"board": null
	};
	this.board = [
		[null, null],
		[null, null],
		[null, null],
		[null, null]
	];
	this.points = 0;
	this.deck = deck;
	this.hand = pickRandom(deck, 4); //Random starting hand, like Clash Royale
	this.energy = {
		"darkness" : 5,
		"fire" : 5,
		"lightning" : 5
	};
	this.place = function(cardNumber, groupNumber) {
		var card = this.hand[cardNumber];
		this.board[groupNumber].push(card); //Places your card on the board
		this.energy[card.energy[0]] -= card.energy[1]; //Subtracts energy
	}
}
function copy(object) {
	return $.extend(true, {}, object);
}
function exists(item) {
	if (item != null) {
		return true;
	}
}
function place(group) {
	var activePlayer = getActivePlayer();
	var cardToPlace = getSelectedCards("hand");
	if (modifyEnergy(cardToPlace.energy) != false) {
		activePlayer.board[group].push(cardToPlace);
	}
}
function attack(group) {
	var playerToAttack = getOpposingPlayer();
	var attackingPlayer = getActivePlayer();
	var targetCards = playerToAttack.board[group];
	var totalDamage = 0;
	for (var card in getSelectedCards("board")) {
		totalDamage += card.damage; // Adds up the damage of the current player's selected cards.
	}
	for (var index = 0; index < targetCards.length; index += 1) {
		targetCards[index].hp -= totalDamage; // Deals damage to the opposing player's cards.
		if (targetCards[index].hp <= 0) {
			targetCards[index] = null; // Get rid of troops below zero HP!
		}
	}
	endTurn();
}
function clone(object) {
	return $.extend(true, {}, object);
}
function modifyEnergy(modification) { // If you don't have enough energy, then you don't!
	var playerEnergy = getActivePlayer().energy;
	var allowedEnergyValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var energyTypes = ["lightning", "fire", "darkness"];
	var modifiedEnergy = clone(playerEnergy);
	for (var type in energyTypes) {
		var sum = playerEnergy[type] + modification[type];
		if (allowedEnergyValues.includes(sum)) {
			modifiedEnergy[type] = sum;
		}
		else {
			return false;
		}
	}
	playerEnergy = modifiedEnergy;
}
function startMatch() {
	var player = new Player(playerDeck, "player");
	var opponent = new Player(randomDeck(), "opponent");
	opponent.enableAI();

	addPlayer(player);
	addPlayer(opponent);

	howManyPlayers = turnOrder.length;
	turn = rand(howManyPlayers); //Who will go first?

}
function setSelectedCards(location, groupOrIndex) { // Selects cards
	var activePlayer = getActivePlayer();
	activePlayer.selected[location] = groupOrIndex;
}