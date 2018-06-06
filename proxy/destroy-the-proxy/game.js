var forest=[
	[0, 150, false],
	[100, 150, false],
	[300, 200, false],
	[500, 400, true],
	[700, 600, false],
	[800, 500, false],
	[600, 900, true],
	[1000, 1000, false],
	[800, 1200, true],
	[1100, 1000, false],
	[1350, 1200, false],
	[1600, 1500, true],
	[1400, 1000, false],
	[1000, 900, true],
	[1500, 800, false],
	[1400, 800, false]
];
var points=parseInt(document.cookie.substring(11, document.cookie.length));
function setcookie() {
	points=points+10;
	document.cookie="powerballs="+points.toString(10);
}
function detectchar() {
	var bot=document.getElementById("avatar");
	var botcoords=bot.getBoundingClientRect();
	var container=document.getElementById("container");
	var touch=document.elementFromPoint(botcoords.left+38, botcoords.top+76)
	if (touch.className!="platform sprite") {
		container.style.top=container.offsetTop-5+"px";
	}
	if (touch.className=="powerball sprite") {
		touch.style.display="none";
		setcookie();
	}
	if (touch.className=="portal sprite exit") {
		window.location="main.html";
	}
	if (touch.className=="portal sprite enter") {
		window.location="boss.html";
	}
}
function move(event) {
	var count=0;
	var container=document.getElementById("container");
	var bot=document.getElementById("avatar");
	if (event.keyCode=="37" || event.keyCode=="39") {
		container.style.left=container.offsetLeft+(38-parseInt(event.keyCode))*30+"px";
	}
	if (event.keyCode=="38") {
		if (window.detector!=null) {
			clearInterval(window.detector);
			window.detector=null;
		}
		var jump=setInterval(function () {
			if (count<60) {
				container.style.top=container.offsetTop+5+"px";
			}
			else {
				window.setTimeout(function () {
					count=0;
					if (window.detector==null) {
						window.detector=setInterval(detectchar, 10);
					}
					clearInterval(jump);
				}, 100);
			}
			count++;
		}, 10);
	}
}
function setup(coords) {
	var container=document.getElementById("container");
	for (i=0; i<coords.length; i++) {
		var platform=document.createElement("IMG");
		platform.setAttribute("class", "platform sprite");
		platform.setAttribute("src", "platform.png");
		platform.style.top=coords[i][1]+"px";
		platform.style.left=coords[i][0]+"px";
		container.appendChild(platform);
		if (i==0) {
			var portal=document.createElement("IMG");
			portal.setAttribute("class", "portal sprite exit");
			portal.setAttribute("src", "portal.png");
			portal.style.top=platform.offsetTop-100+"px";
			portal.style.left=platform.offsetLeft+113+"px";
			container.appendChild(portal);
		}
		if (i==coords.length-1) {
			var portal2=document.createElement("IMG");
			portal2.setAttribute("class", "portal sprite enter");
			portal2.setAttribute("src", "portal2.png");
			portal2.style.top=platform.offsetTop-100+"px";
			portal2.style.left=platform.offsetLeft+113+"px";
			container.appendChild(portal2);
		}
		if (coords[i][2]==true) {
			var powerball=document.createElement("IMG");
			powerball.setAttribute("class", "powerball sprite");
			powerball.setAttribute("src", "powerball.png");
			powerball.style.top=platform.offsetTop-50+"px";
			powerball.style.left=platform.offsetLeft+88+"px";
			container.appendChild(powerball);
		}
	}
	if (document.cookie.length==0) {
		points=0;
		document.cookie="powerballs=0";
	}
	window.addEventListener("keydown", move);
	window.detector=setInterval(detectchar, 10);
}