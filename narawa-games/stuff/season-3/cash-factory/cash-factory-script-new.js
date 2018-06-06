function startGameLoop() {
	globals.loop = window.setInterval(gameLoop, 50);
}
function stopGameLoop() {
	window.clearInterval(globals.loop);
}
function unlockNewBusiness(){
	//Puts all the new HTML you unlocked into the appropriate areas.
	globals.unlockLevel += 1;
	if (globals.unlockLevel >= globals.unlockOrder.length) { //If this is the last business you can unlock, get rid of the "Unlock New Business" button!
		$("#new-business-button").remove();
	}
	updateBusinessObjects();
	var html = [];
	var businessName = globals.unlockedObject.businessName;
	html[0] = "\
		<div class='clickable tile dark-text' data-action=\"work('**UNLOCK**');\" id='**UNLOCK**'>\
			<div class='progress-bar'></div>\
			<div class='very-big-text on-top'>" + businessName + "</div>\
			<p class='replace-text on-top' data-code=\"'Cost Per Worker: ' + dollar(game['**UNLOCK**'].costs)\">\
\
			</p>\
			<p class='replace-text on-top' data-code=\"'Workers Working: ' + game['**UNLOCK**'].workersUsed\">\
\
			</p>\
		</div>\
	";
	html[0] = html[0].replace(/\*\*UNLOCK\*\*/gmi, globals.unlockedItem);
	html[1] = "\
		<div class='clickable tile dark-text' data-action=\"advertise('**UNLOCK**');\" id='**UNLOCK**-advertise'>\
			<div class='progress-bar'></div>\
			<div class='very-big-text on-top'>" + businessName + "</div>\
			<p class='replace-text on-top' data-code=\"'Advertising Cost: ' + dollar(game['**UNLOCK**'].advertisingCost)\">\
			</p>\
			<p class='replace-text on-top' data-code=\"'Advertising Duration: ' + game['**UNLOCK**'].advertisingDuration\">\
			</p>\
		</div>\
	";
	html[1] = html[1].replace(/\*\*UNLOCK\*\*/gmi, globals.unlockedItem);
	//TODO: for loop
	$("#workers-page-list-html").append(html[0]);
	$("#advertising-page-list-html").append(html[1]);

	achievement("unlock", globals.unlockedItem);
	update();
}
function updateBusinessObjects() {
	globals.unlockedItem = globals.unlockOrder[globals.unlockLevel];
	globals.unlockedObject = game[globals.unlockedItem];
}
function achievement(category, thing) {
	var achievementObject = achievements[category][thing];
	var html = "\
		<div class='clickable tile dark-text' data-action=\"deposit(" + achievementObject.earnings + "); deactivateClickableTile($(this));\">\
			<div class='very-big-text on-top'>" + achievementObject.name + "</div>\
			<p class='description'>\
			" + achievementObject.description + "\
			</p>\
			<p>\
			Reward for claiming this achivement: " + achievementObject.earnings + "\
			</p>\
		</div>\
	";
	$("#achievement-list").append(html);
}
function subtract(amount) {
	if (isThereEnoughMoney(amount) == true) {
		globals.cash -= amount;
	}
	update();
}
function advertise(business) {
	var job = game[business];
	game[business].market.currentlyAdvertising = true;
	window.setTimeout(function() {
		game[business].market.currentlyAdvertising = false;
	}, job.market.advertisingDuration);
}
function dollar(number) {
	return "$" + Math.round(number * 100) / 100;
	update();
}
function deposit(amount) {
	globals.cash += amount;
	update();
}
function tax() {
	globals.cash *= 0.9;
	update();
}
function dictionaryLoop(dictionary, callback, before, after) {
	before();
	$.each(dictionary, callback);
	after();
}
function finished(job) {
	jobObject = game[job];
	game[job].progress[0] = 0;
	globals.totalWorkersUsed -= jobObject.workersUsed;
	game[job].workersUsed = 0;
	game[job].inventoryQuantity += 1;
	update();
}
function returnBusinessListHTML() {
	var html = "";
	for (var index = 0; index <= globals.unlockLevel; index++) {
		var businessName = globals.unlockOrder[index];
		var html = html + "\
			<div class='tile dark-text'>\
				<div class='huge-text'>" + businessName + "</div>\
			</div>\
		";
	}
	return html;
}
function returnInventoryItems() {
	var html = "";
	for (var index = 0; index < globals.inventoryList.length; index++) {
		var nameOfProduct = globals.inventoryList[index];
		//console.log(nameOfProduct);
		var html = html + "\
			<div class='tile dark-text'>\
				<div class='very-big-text'>\
		" + game[nameOfProduct].productName + "\
				</div>\
				<p class='replace-text' data-code=\"'Revenue: ' + dollar(game['" + nameOfProduct + "'].revenues)\">\
				</p>\
			</div>\
		";
	}
	return html;
}

function update() {
	dictionaryLoop(game, function(key, value) {
		game[key].totalWorkerSpeeds = value.workersUsed * globals.workerSpeed;
		globals.inventoryList = [];
		for (var x = 0; x < value.inventoryQuantity; x++) {
			globals.inventoryList.push(key);
		}

		updateBusinessObjects();

		$("#inventory-list").html(returnInventoryItems()); // To avoid confusion with the one on the bottom
		$("#business-list").html(returnBusinessListHTML()); // To avoid confusion with the one on the bottom
		$(".replace-text").each(function() {
			var parsedAttributeObject = eval($(this).attr("data-code"));
			$(this).html(parsedAttributeObject);
		});

		$(".clickable").off();
		$(".clickable").on("click", function(event) {
			eval($(this).attr("data-action"));
		});
	}, function() {}, function() {});
}

function deactivateClickableTile(element) {
	element.css("background-image", "linear-gradient(to bottom, silver, lightgray)");
	element.attr("data-action", "");
}

function gameLoop() {
	/*dictionaryLoop(progress, function(key, value) {
		var job = key;
		var progressItem = value;
		progressItem[0] = progressItem[0] + totalWorkerSpeeds[job];
		var calculatedWidth = (progressItem[0] / progressItem[1]) * 100;
		$("#" + job + " .progress-bar").css("width", calculatedWidth + "%");
		if (progressItem[0] >= progressItem[1]) {
			finished(job);
		}
	}, function() {}, function() {});
	dictionaryLoop(workersUsed, function(key, value) {
		localVariables.counter = localVariables.counter + value;
	}, function() {
		localVariables.counter = 0;
	}, function() {
		totalWorkersUsed = localVariables.counter;
	});
	dictionaryLoop(inventory, function(key, value) {
		var itemCount = value;
		var item = key;
		for (var counter = 0; counter < itemCount; counter++) {
			localVariables.productsList.push(item);
			localVariables.productNamesList.push(productNames[item]);
		}
	}, function() {
		localVariables.productsList = [];
		localVariables.productNamesList = [];
	}, function() {*/
	dictionaryLoop(game, function(key, value) {
		game[key].progress[0] += game[key].totalWorkerSpeeds;
		var progress = [game[key].progress[0], value.progress[1]];
		var calculatedWidth = (progress[0] / progress[1]) * 100;
		$("#" + key + " .progress-bar").css("width", calculatedWidth + "%");
		if (progress[0] >= progress[1]) {
			finished(key);
		}
		if (value.inventoryQuantity > 0 && globals.tick % value.market.customerRate == 0) {
			buy(globals.inventoryList[random]);
		}
		game[key].market.customerRate = value.market.originalCustomerRate * (1 - value.market.currentlyAdvertising * globals.advertisingRateDifference);
	}, function() {}, function() {});

	// If the tutorial is off...
	if (tutorial.on == false) {
		if ((globals.tick + 3000) % 6000 == 0) {
			popup("It's salary time! You got your paycheck of " + dollar(globals.salaryAmount) + ".", "ACCEPT", salary);
		}
		if (globals.tick % 6000 == 0) {
			popup("It's time to pay your taxes! You owe " + dollar(globals.cash * 0.1) + " in taxes.", "PAY", tax);
		}
	}

	globals.tick += 1;
	globals.tick = Math.round(globals.tick);
	update();
}
function popup(content, buttonText, callback) {
	var dialogBox = $("<div class='popup dark-text big-text'></div>");
	dialogBox.html("<p>" + content + "</p>");
	var button = $("<div class='button tile very-big-text white-text'></div>");
	button.html(buttonText);
	button.on("click", function() {
		$(this).parent().remove();
		callback();
	});
	dialogBox.append(button);
	$("body").append(dialogBox);
}
function switchToPage(page) {
	$('.page').css('display', 'none'); $('#' + page).css('display', 'block');
}
function modifyProperty(object, property, byHowMuch) {
	object[property] *= byHowMuch;
	update();
}
function modifyVariable(variable, byHowMuch) {
	variable *= byHowMuch;
	update();
}
function isThereEnoughMoney(amount) {
	if (globals.cash - amount >= 0) {
		return true;
	}
	else {
		return false;
	}
	update();
}
function buy(product) {
	deposit(game[product].revenues);
	game[product].inventoryQuantity -= 1;
	update();
}
function salary() {
	deposit(globals.salaryAmount);
	update();
}
function work(job) {
	var cost = game[job].costs;
	if (globals.totalWorkersUsed < globals.workers) {
		if (isThereEnoughMoney(cost) == true) {
			game[job].workersUsed += 1;
			globals.totalWorkersUsed += 1;
			subtract(cost);
		}
	}
	update();
}
function hire() {
	if (isThereEnoughMoney(globals.newWorkerCost) == true) {
		globals.workers += 1;
		subtract(globals.newWorkerCost);
		modifyVariable(globals.newWorkerCost, 1.1);
	}
	update();
}
function upgrade(item) {
	var upgradeItem = upgrades[item];
	var upgradeCost = upgradeItem.cost;
	if (isThereEnoughMoney(upgradeCost) == true) {
		upgradeItem.effect();
		subtract(upgradeCost);
		modifyProperty(upgrades[item], "cost", upgradeItem.inflation);
	}
	update();
}
$(document).ready(function() {
	unlockNewBusiness();
	update();
	startGameLoop();
	tutorial.functions.beginTutorial();
});