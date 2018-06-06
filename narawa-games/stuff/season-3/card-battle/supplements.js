//var timers = [];
var board, turn, selected;


function randomChoice(list) {
	var randomIndex = Math.floor(Math.random() * list.length);
	return list[randomIndex];
}


function startMatch() {
	turn = randomChoice(["player", "opponent"]);
	selected = {
		player: [],
		opponent: []
	}
	board = {
		player: [
			[null, null],
			[null, null],
			[null, null],
			[null, null]
		],
		opponent: [
			[null, null],
			[null, null],
			[null, null],
			[null, null]
		]
	};
}


function nextRound() {
	switch (turn) {
		case ("player"):
			turn = "opponent";
			break;
		case ("opponent"):
			turn = "player";
			break;
	}
}
function attack(attacker, target) {
	target.hp -= attacker.damage;
}
/*function removeDeadCards() {
	for (var x = 0; x < board.length; x += 1) {
		if (board[x].hp <= 0) {
			board[x] = null;
		}
	}
}
function placeCard(card, slot) { //FLAWED!!!
	var target = board[slot];
	switch (card.type) {
		case ("spell"):
			attack(card, target); //Deploys a spell on a card
			break;
		case ("troop"):
			
			break;
	}
	nextRound();
}*/
function average(list) {
	var total = 0;
	var length = list.length;
	for (var x = 0; x < length; x += 1) {
		total += list[x];
	}
	return total / length;
}
function num(string) {
	return parseInt(string);
}
function exists(item) {
	if (item != null) {
		return true;
	}
}
function doDamage(target, damage) {
	if (exists(target)) {
		target.hp -= damage;
	}
}
function groupAttack(targetGroupIndex) {
	var selectedElement = $(".selected");
	var groupIndex = num(selectedElement.attr("data-group-ID"));
	var selectedCards = board.player[groupIndex];

	var listOfDamageValues = [];
	for (var x in selectedCards) {
		listOfDamageValues.append(x.hp);
	}
	var averageDamage = average(listOfDamageValues);
	var targetCards = board.opponent[targetGroupIndex];
	for (var x in targetCards) {
		doDamage(x, averageDamage);
	}
}
function selectCards(group) {
	$(".row").toggleClass("selected");
}