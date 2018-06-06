function exp(number, power) {
	return Math.pow(number, power);
}
function hyp(x, y) {
	var square = exp(x, 2) + exp(y, 2);
	return root(square);
}
function root(number) {
	return Math.sqrt(number);
}
function pixelsToDegrees(degrees, x, y) {
	var quotient = y / x;
	var radians = Math.atan(quotient);
	var degrees = radians * (180 / Math.PI);
	return degrees;
}
function degreesToPixels(degrees, hypotenuse) {
	var radians = degrees * (Math.PI / 180);
	var quotient = Math.tan(radians);
	var baseRatio = {
		x : 1, 
		y : quotient
	};
	var magnification = exp(hypotenuse, 2) / (exp(baseRatio.x, 2) + exp(baseRatio.y, 2));
	var adjustedRatio = {
		x : baseRatio.x * root(magnification),
		y : baseRatio.y * root(magnification)
	};
	return adjustedRatio;
}
function collisionResponse(aMomentum, bMomentum) {
	var aSpeed = hyp(aMomentum.x, aMomentum.y);
	var bSpeed = hyp(bMomentum.x, bMomentum.y);
	var divisionFactor = aSpeed + bSpeed;
	var fractionSize = 1 / divisionFactor;
	var multiplicationFactor = {a : fractionSize * aSpeed, b : fractionSize * bSpeed};
	var xMomentum = aMomentum.x + bMomentum.x;
	var yMomentum = aMomentum.y + bMomentum.y;
	var resultingMomentum = {
		a : {x : xMomentum * multiplicationFactor.a, y : yMomentum * multiplicationFactor.a},
		b : {x : xMomentum * multiplicationFactor.b, y : yMomentum * multiplicationFactor.b}
	};
	return resultingMomentum;
}