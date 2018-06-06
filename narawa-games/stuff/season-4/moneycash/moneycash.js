var game = {

	businessUpgrades: {
		lemonade: [
			[ // level 1 changes (from level 0)
				["unlocked", true],
				["level", 1],
				["maxWorkers", 35],
				["upgradeCost", 5000],
				["products.regular.unlocked", true],
				["", ],
				["", ],
				["", ],
				["", ],
				["", ],
				["", ]
			],
			[ // level 2 changes (from level 1)
				["products.regular.advertising.unlocked", true],
				["level", 2],
				["maxWorkers", 50],
				["upgradeCost", 100000],
				["products.strawberry.unlocked", true],
				["", ],
				["", ],
				["", ],
				["", ],
				["", ],
				["", ]
			]
		]
	},

	cash: 0,
	tickCycle: function() {

	},
	calculateOffline: function() {

	},




	



	advertising: {
		lemonade: {
			regular: game.businesses.lemonade.regular.advertising
			strawberry: game.businesses.lemonade.strawberry.advertising
			honey: game.businesses.lemonade.honey.advertising
			iceCream: game.businesses.lemonade.iceCream.advertising
			herbalTea: game.businesses.lemonade.herbalTea.advertising
		},
		coffee: {

		}
	},



	company: {
		agent: {
			pricePerHour: 20
		}
	},
	businesses: {

		lemonade: {
			unlocked: false,
			level: 0,
			unlockCost: 1000,

			maxWorkers: 35,
			upgradeCost: 5000,

			products: {
				regular: {
					unlocked: false,
					workers: [0, 0, 0, 0, 0, 0],
					makeCost: 0.10
					advertising: {

					}
				},
				strawberry: {

				},
				honey: {

				},
				iceCream: {

				},
				herbalTea: {

				}
			}

		},
		coffee: {

		}

	},
	workers: {
		lookingForJob: 10,
		workerCountsByLevel: [0, 0, 0, 0, 0, 0],
		totalWorkerCount: 0,

		levelTrainingCosts: [10000, 20000, 50000, 100000, 500000],
		levelTrainingQueueCounts: [0, 0, 0, 0, 0]
	},
	metrics: {
		customerSatisfaction: 100,
		totalMoneyEarned: 0,
		workerHappiness: 100
	},
	bank: {

	},
	warehouse: {

	},



	settings: {

	},
	store: {

	}
};