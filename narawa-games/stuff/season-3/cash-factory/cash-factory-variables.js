var localVariables = {}; //Used to store variables that need to be used in other functions but are not global.
var globals = {
	loop: null,
	cash: 50,
	inventoryList: [],
	workers: 5,
	newWorkerCost: 1,
	tick: 1,
	totalWorkersUsed: 0,
	salaryAmount: 20,
	workerSpeed: 0.01,
	unlockOrder: ["lemonade", "newspaper-delivery", "fast-food", "school-supplies-factory", "airline-company", "toy-factory", "movie-studio", "high-tech-manufacturing"],
	unlockLevel: -1,
	unlockedObject: null,
	unlockedItem: null,
	loop: null,
	inventorySizeLimit: 10,
	advertisingRateDifference: 0.5
};
var game = {
	"lemonade": {
		productName: "Lemonade Drink",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 1],
		costs: 0.10,
		inventoryQuantity: 0,
		revenues: 0.25,
		businessName: "Lemonade Stand",
		unlockCost: 0,
		market: {
			advertisingCost: 5,
			customerRate: 100,
			advertisingDuration: 10000,
			currentlyAdvertising: false
		}
	},
	"newspaper-delivery": {
		productName: "Newspaper",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 5],
		costs: 1,
		inventoryQuantity: 0,
		revenues: 5,
		businessName: "Newspaper Delivery Company",
		unlockCost: 50,
		market: {
			advertisingCost: 10,
			customerRate: 200,
			advertisingDuration: 15000,
			currentlyAdvertising: false
		}
	},
	"fast-food": {
		productName: "Hamburger",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 10],
		costs: 5,
		inventoryQuantity: 0,
		revenues: 10,
		businessName: "Fast Food Company",
		unlockCost: 100,
		market: {
			advertisingCost: 20,
			customerRate: 300,
			advertisingDuration: 20000,
			currentlyAdvertising: false
		}
	},
	"school-supplies-factory": {
		productName: "School Supples Pack",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 50],
		costs: 10,
		inventoryQuantity: 0,
		revenues: 25,
		businessName: "School Supplies Factory",
		unlockCost: 200,
		market: {
			advertisingCost: 30,
			customerRate: 400,
			advertisingDuration: 30000,
			currentlyAdvertising: false
		}
	},
	"airline-company": {
		productName: "Airplane Ticket",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 100],
		costs: 100,
		inventoryQuantity: 0,
		revenues: 1000,
		businessName: "Airlines Company",
		unlockCost: 500,
		market: {
			advertisingCost: 50,
			customerRate: 500,
			advertisingDuration: 50000,
			currentlyAdvertising: false
		}
	},
	"toy-factory": {
		productName: "Childrens' Toy",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 200],
		costs: 250,
		inventoryQuantity: 0,
		revenues: 5000,
		businessName: "Toy Factory",
		unlockCost: 1000,
		market: {
			advertisingCost: 75,
			customerRate: 1000,
			advertisingDuration: 100000,
			currentlyAdvertising: false
		}
	},
	"movie-studio": {
		productName: "DVD",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 1000],
		costs: 5000,
		inventoryQuantity: 0,
		revenues: 10000,
		businessName: "Movie Studio",
		unlockCost: 2500,
		market: {
			advertisingCost: 100,
			customerRate: 2000,
			advertisingDuration: 200000,
			currentlyAdvertising: false
		}
	},
	"high-tech-manufacturing": {
		productName: "Computer",
		totalWorkerSpeeds: 0,
		workersUsed: 0,
		progress: [0, 10000],
		costs: 100000,
		inventoryQuantity: 0,
		revenues: 500000,
		businessName: "High-Tech Manufacturing Facility",
		unlockCost: 5000,
		market: {
			advertisingCost: 200,
			customerRate: 3000,
			advertisingDuration: 300000,
			currentlyAdvertising: false
		}
	}
};
var achievements = {
	"unlock": {
		"lemonade": {
			earnings: 10,
			description: "Unlock your first business",
			name: "Untrepunoor"
		},
		"newspaper-delivery": {
			earnings: 20,
			description: "Unlock the newspaper delivery company",
			name: "Paper Route"
		},
		"fast-food": {
			earnings: 50,
			description: "Unlock the fast-food company",
			name: "McDonald's"
		},
		"school-supplies-factory": {
			earnings: 75,
			description: "Unlock the school supplies company",
			name: "West Briar Middle School"
		},
		"airline-company": {
			earnings: 100,
			description: "Unlock the airlines company",
			name: "Air Fare"
		},
		"toy-factory": {
			earnings: 250,
			description: "Unlock the toy factory",
			name: "Kid's Corner"
		},
		"movie-studio": {
			earnings: 1000,
			description: "Unlock the movie studio",
			name: "Fast and Furious"
		},
		"high-tech-manufacturing": {
			earnings: 10000,
			description: "Unlock the high-tech-manufacturing facility",
			name: "High-Tech Awesomeness!"
		}
	},
	"milestone": {
		"complete-tutorial": {
			earnings: 50,
			description: "Finish the tutorial of this game",
			name: "Startup"
		}
	}
};
var upgrades = {
	"workers": {
		"cost": 1,
		inflation: 1.2,
		effect: function() {
			globals.workerSpeed += 0.1;
		}
	},
	"revenues": {
		"cost": 100,
		inflation: 1.1,
		effect: function() {
			dictionaryLoop(game, function (key, value) {
				modifyProperty(game[key], revenues, 1.1);
			}, function() {}, function() {});
		}
	},
	"advertisingSpeed": {
		"cost": 200,
		inflation: 1.5,
		effect: function() {
			globals.advertisingRateDifference += (1 - globals.advertisingRateDifference) / 10;
		}
	},
	"advertisingDuration": {
		"cost": 300,
		inflation: 1.25,
		effect: function() {
			dictionaryLoop(game, function (key, value) {
				modifyProperty(game[key].market, advertisingDuration, 0.9);
			}, function() {}, function() {});
		}
	}
};
var tutorial = {
	on: true,
	step: 0,
	contents: [
		"Welcome to Cash Factory. The number on the top-left corner is your money. You should have $50 right now.",
		"Cash Factory is all about money. You create businesses, hire workers, and sell products. The goal of this game is to get as much money as possible...",
		"...but you never will, because the tax rate in this game is 100%. Too bad!"
	],
	element: [
		"#money",
		"#lemonade",
		"#inventory-list",
		"#inventory-explanation-paragraph",
		"#upgrades-explanation-paragraph",
		"#achievements-explanation-paragraph",
		"#new-business-button",
		"#money"
	],
	functions: {
		endTutorial: function() {
			tutorial.on = false;
			achievement("milestone", "complete-tutorial");
			switchToPage("achievements");
		},

		advanceTutorial: function() {
			popup(tutorial.contents[tutorial.step], "NEXT >", function() {
				if (tutorial.step < tutorial.contents.length) {
					tutorial.functions.advanceTutorial();
				}
				else {
					tutorial.functions.endTutorial();
				}
			});
			tutorial.step += 1;
		},
		resetPopUpPositioning: function() {
			$("#tutorial").css({"top": "0", "left": "0", "right": "0", "bottom": "0"});
		},
		beginTutorial: function() { // Puts the tutorial box on the screen.
			tutorial.functions.advanceTutorial();
		}
	}
};