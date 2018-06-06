var tick = 1;
var localVariables = {}; //Used to store variables that need to be used in other functions but are not global.
var newWorkerCost = 1; //The cost of hiring a new worker.
var customerRate = 20; //The interval at which one of your products will be bought from your inventory by a customer.
var workerSpeed = 0.1; //How fast a worker "goes."
var workers = 5; //How many workers you have right now.
var salaryAmount = 20; //How much is your salary.
var totalWorkersUsed = 0; //The total number of workers being used right now.
var inventoryList = []; //All the items in the inventory, in a "list" fashion.
var productNames = {
	"lemonade": "Lemonade Drink",
	"newspaper-delivery": "Newspaper",
	"fast-food": "Hamburger",
	"school-supplies-factory": "School Supplies",
	"airline-company": "Airline Ticket",
	"toy-factory": "Childrens' Toy",
	"movie-studio": "DVD",
	"high-tech-manufacturing": "Supercomputer"
};
var reverseProductNames = {
	"Lemonade Drink": "lemonade",
	"Newspaper": "newspaper-delivery",
	"Hamburger": "fast-food",
	"School Supplies": "school-supplies-factory",
	"Airline Ticket": "airline-company",
	"Childrens' Toy": "toy-factory",
	"DVD": "movie-studio",
	"Supercomputer": "high-tech-manufacturing"
};
var totalWorkerSpeeds = {
	"lemonade": 0,
	"newspaper-delivery": 0,
	"fast-food": 0,
	"school-supplies-factory": 0,
	"airline-company": 0,
	"toy-factory": 0,
	"movie-studio": 0,
	"high-tech-manufacturing": 0
};
var workersUsed = {
	"lemonade": 0,
	"newspaper-delivery": 0,
	"fast-food": 0,
	"school-supplies-factory": 0,
	"airline-company": 0,
	"toy-factory": 0,
	"movie-studio": 0,
	"high-tech-manufacturing": 0
};
var progress = {
	"lemonade": [0, 1],
	"newspaper-delivery": [0, 5],
	"fast-food": [0, 10],
	"school-supplies-factory": [0, 50],
	"airline-company": [0, 100],
	"toy-factory": [0, 200],
	"movie-studio": [0, 1000],
	"high-tech-manufacturing": [0, 10000]
};
var cash = 100;
var inventory = {
	"lemonade": 0,
	"newspaper-delivery": 0,
	"fast-food": 0,
	"school-supplies-factory": 0,
	"airline-company": 0,
	"toy-factory": 0,
	"movie-studio": 0,
	"high-tech-manufacturing": 0
};
var upgradeCosts = {
	"workers" : 1,
	"revenues" : 100
};
var costs = {
	"lemonade": 0.10,
	"newspaper-delivery": 1,
	"fast-food": 5,
	"school-supplies-factory": 10,
	"airline-company": 100,
	"toy-factory": 250,
	"movie-studio": 5000,
	"high-tech-manufacturing": 100000
};
var revenues = {
	"lemonade": 0.25,
	"newspaper-delivery": 5,
	"fast-food": 10,
	"school-supplies-factory": 25,
	"airline-company": 1000,
	"toy-factory": 5000,
	"movie-studio": 10000,
	"high-tech-manufacturing": 500000
};
var loop = null;
function subtract(amount) {
	if (isThereEnoughMoney(amount) == true) {
		cash = cash - amount;
	}
}
function dollar(number) {
	return "$" + Math.round(number * 100) / 100;
}
function deposit(amount) {
	cash = cash + amount;
}
function tax() {
	cash = cash * 0.9;
}
function dictionaryLoop(dictionary, callback, before, after) {
	before();
	$.each(dictionary, callback);
	after();
}
function finished(job) {
	progress[job][0] = 0;
	totalWorkersUsed = totalWorkersUsed - workersUsed[job];
	workersUsed[job] = 0;
	inventory[job] = inventory[job] + 1;
	totalWorkerSpeeds[job] = 0;
}
function returnInventoryItems() {
	var html = "";
	for (var index = 0; index < inventoryList.length; index++) {
		var productName = inventoryList[index];
		var html = html + "\
			<div class='tile dark-text'>\
				<div class='very-big-text'>\
		" + productName + "\
				</div>\
				<p class='replace-text' data-code=\"'Revenue: ' + dollar(revenues['" + reverseProductNames[productName] + "'])\">\
				</p>\
			</div>\
		";
	}
	return html;
}
function gameLoop() {
	dictionaryLoop(progress, function(key, value) {
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
	}, function() {
		if (localVariables.productsList.length > 0 && tick % customerRate == 0) {
			var random = Math.floor(Math.random() * localVariables.productsList.length);
			buy(localVariables.productsList[random]);
		}
		inventoryList = localVariables.productNamesList;
	});
	dictionaryLoop(totalWorkerSpeeds, function(key, value) {
		totalWorkerSpeeds[key] = workersUsed[key] * workerSpeed;
	}, function() {}, function() {});
	if ((tick + 300) % 600 == 0) {
		salary();
	}
	if (tick % 600 == 0) {
		tax();
	}
	$("#inventory-list").html(returnInventoryItems()); // To avoid confusion with the one on the bottom
	$(".replace-text").each(function() {
		var parsedAttributeObject = eval($(this).attr("data-code"));
		$(this).html(parsedAttributeObject);
	});
	tick = tick + 1;
}
function modifyProperty(object, property, byHowMuch) {
	object[property] = object[property] * byHowMuch;
}
function modifyVariable(variable, byHowMuch) {
	variable = variable * byHowMuch;
}
function isThereEnoughMoney(amount) {
	if (cash - amount >= 0) {
		return true;
	}
	else {
		return false;
	}
}
function buy(product) {
	deposit(revenues[product]);
	inventory[product] = inventory[product] - 1;
}
function salary() {
	deposit(salaryAmount);
}
function work(job) {
	var cost = costs[job];
	if (totalWorkersUsed < workers) {
		if (isThereEnoughMoney(cost) == true) {
			workersUsed[job] = workersUsed[job] + 1;
			totalWorkersUsed = totalWorkersUsed + 1;
			subtract(cost);
		}
	}
}
function hire() {
	if (isThereEnoughMoney(newWorkerCost) == true) {
		workers = workers + 1;
		subtract(newWorkerCost);
		modifyVariable(newWorkerCost, 1.1);
	}
}
function upgrade(item) {
	var upgradeCost = 0;
	switch (item) {
		case ("workers"):
			upgradeCost = upgradeCosts["workers"];
			break;
		case ("revenues"):
			upgradeCost = upgradeCosts["revenues"];
			break;
	}
	if (isThereEnoughMoney(upgradeCost) == true) {
		switch (item) {
			case ("workers"):
				workerSpeed  = workerSpeed + 0.1;
				break;
			case ("revenues"):
				dictionaryLoop(revenues, function (key, value) {
					// value = value * 1.1;
					modifyProperty(revenues, key, 1.1);
				}, function() {}, function() {});
				break;
		}
		subtract(upgradeCost);
		modifyProperty(upgradeCosts, item, 1.1);
	}
}
$(document).ready(function() {
	$(".clickable").on("click", function(event) {
		eval($(this).attr("data-action"));
	});
	loop = window.setInterval(gameLoop, 500);
});