var salary = 2000;

var ticks = 0;
var tickActions = [
	[10, buyProduct],
	[10, payTaxes],
	[1, salary]
];

function convertToMoney(amount) {
	return parseFloat(parseFloat(amount).toFixed(2)); // This function rounds numbers to the 2nd decimal place, just like money ($x.xx)
}

function payTaxes() {
	var totalMoney = convertToMoney($("#money").html());
	pay(totalMoney * 0.1); // so you pay 10% tax
}

function salary() {
	pay(-salary); // Paying negative money is basically giving you money
}

function buyProduct() {
	// Calculate the chance of a customer buying a product

	console.log("yo");
}

function pay(amount) {
	var number = convertToMoney(amount); // Subtracts an anount of money from your money amount
	var money = convertToMoney($("#money").html());
	if (money - number >= 0) {
		$("#money").html(money - number);
		return true;
	}
	else {
		alert("You don't have any money left!");
		return false;
	}
}

function hireNewWorker() {
	var workerCount = parseInt($("#total-workers").html())
	var cost = convertToMoney($("#worker-hire-cost").html());
	if (pay(cost)) { // If you can afford this, do the following:
		$("#total-workers").html(workerCount + 1);
		$("#worker-hire-cost").html(convertToMoney(cost * 1.1));
	}
}

function assignWorkerToJob(event) {
	var $job = $(event.currentTarget);

}

function tick() {
	ticks += 1;
	for (var x = 0; x < tickActions.length; x += 1) {
		if (ticks % tickActions[x][0] == 0) {
			tickActions[x][1]();
		}
	}
}

$(document).ready(function() {
	window.setInterval(tick, 100);
});