function int(string) {
	return parseInt(string);
}
function getCard(group, slot) {
	var selector = ".board." + turn + " .card-group[data-group='" + group + "'] .card-slot[data-slot='" + slot + "']";
	return $(selector);
}
function getCardInfo(card, property) {
	var propertyHTML = card.find(".card-property[data-name='" + property + "']");
	return int(propertyHTML.html());
}

function get(thing) {
	switch (thing) {
		case "hand":
			return $("#" + turn + "-hand");
		case "cards":
			return $(".card[data-owner=\"" + turn + "\"]");
	}
}

function cardBelongsTo(card) {
	return card.attr("data-owner");
}

function slotHasCard(slot) {
	var cardInSlot = slot.find(".card");
	if (cardInSlot.length > 0) {
		return cardInSlot;
	}
	else {
		return false;
	}
}

function clickSlot(event) {
	var slot = $(event.currentTarget);

	if (slotHasCard(slot) != false) {
		$(".card-slot").removeClass("selected");
		slot.addClass("selected");
	}
	else {
		slot.append($(".selected .card"));
		$(".card-slot").removeClass("selected");
	}
}
function attack(event) {
	
}
function getOpponent() {
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
	turn = getOpponent();
	modifyEnergy({
		"lightning": 1,
		"fire": 0,
		"darkness": 0
	});
	modifyEnergy({
		"lightning": 0,
		"fire": 1,
		"darkness": 0
	});
	modifyEnergy({
		"lightning": 0,
		"fire": 0,
		"darkness": 1
	});
}
function play(deck) {

}
function getCardStats(name) {
	return cards[name];
}

$(document).ready(function() {
	$(".card-slot").on("click", clickSlot);
});