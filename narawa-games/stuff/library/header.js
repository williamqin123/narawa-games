$(document).ready(function() {
	var body = $("body");
	var pageName = body.attr("id");
	var nameMod = new RegExp("replaceForPage" + pageName, "gmi");
	var seasons = [0, 1, 2, 3];
	var navBar = "<header><h1><img src=\"../library/logo.png\" width=\"80\" height=\"64\" class=\"inline logo\"> %replace1%</h1> \
			<nav class=\"primary light\"><a href=\"../main/index.html\" class=\"replaceForPageHome\">Home</a> \
			<a href=\"../main/seasonslist.html\" class=\"replaceForPageGames\">Games</a> \
			<a href=\"../main/books.html\" class=\"replaceForPageBooks\">Books</a> \
			<a href=\"../main/videos.html\" class=\"replaceForPageVideos\">Videos</a> \
			<a href=\"../main/extras.html\" class=\"replaceForPageExtras\">Webapps</a> \
			<a href=\"../categories/external.html\" class=\"replaceForPageExtras\">More...</a> \
		</nav></header>".
		replace(
			/%replace1%/gi, pageName.replace("_", " ")
		).
		replace(nameMod, "selectnav");
	var header = navBar + " \
		<main> \
		<!--[if IE lte 9]> \
			<div class=\"warning game creative\"> \
				<img class=\"warningimg\" src=\"../library/caution.png\" width=\"80\" height=\"70\" alt=\"\"> \
				<h3> \
				You're using an old browser. It doesn't support the new technology that Narawa Games uses. You might experience some glitches. \
				</h3> \
			</div> \
		<![endif]-->";
	var seasonSwitcher = "";
	var seasonIndex = pageName.indexOf("Season");
	if (seasonIndex >= 0) {
		var scoreIndex = seasons[parseInt(pageName.substr(pageName.indexOf("_")+1, 1))];
		seasonSwitcher += "<nav class=\"dark\">";
		var opening = "<a href=\"season";
		var closing2 = ".html\">";
		var closing = "</a>";
		if (scoreIndex > 1) {
			seasonSwitcher += opening + (scoreIndex - 1) + closing2 + "&#9664; Season " + (scoreIndex - 1) + closing;
		}
		seasonSwitcher += "<a href=\"gsm.html\">Gamestar Mechanic</a><a href=\"external.html\">External Games</a>";
		if (scoreIndex < seasons.length - 1) {
			seasonSwitcher += opening + (scoreIndex + 1) + closing2 + "Season " + (scoreIndex + 1) + " &#9654;" + closing;
		}
		
		seasonSwitcher += "</nav>";
	}
	var footer = seasonSwitcher + "<p class=\"spacer\">&nbsp;</p>\
		<div class=\"card\">\
		<h2 class=\"card-title\">\
			Information\
		</h2>\
		<p>\
		&copy; Copyright 2013 &mdash; 2015, Narawa Games.\
		</p>\
		<p>\
		N.A.R.A.W.A. is actually an acronym that stands for the names of the original founders of the website. Nischay Palnati, Arjun Kodali, Rahul R. D. M., Adam Henderson, William Qin, and Andrew Redman.\
		</p>\
		<p>\
		NG is written in <a href=\"http://python.org\">Python,</a>\
		<a href=\"//www.w3.org/standards/webdesign/htmlcss.html\">HTML5,</a>\
		<a href=\"//www.w3.org/Style/CSS/Overview.en.html\">CSS3,</a>\
		and <a href=\"//www.w3.org/standards/webdesign/script\">JavaScript.</a>\
		The <a href=\"//www.python.org\">Python</a>\
		library used is <a href=\"//appengine.google.com\">WebApp2, run on App Engine, made by Google.</a>\
		</p>\
		</div>\
	</main>";
	body.html(header + body.html() + footer);
});
function dialog(content) {
	var dialogHTML = "<div class='dialog'><div class='close-button'><img src='../library/pop-up-close-button.png' width='32' height='32'></div><p class='spacer'>&nbsp;</p>" + content + "</div>";
	$("body").append(dialogHTML);
	//var windowObject=$(window);
	//var dimensions=[windowObject.width(), windowObject.height()];
	/*var sizeCalculator=window.setInterval(function () {
		dialog.css({"top": (dimensions[1]/2)+"px", "left": (dimensions[0]/2)+"px", "margin-top": (dialog.outerHeight()/-2)+"px", "margin-left": (dialog.outerWidth()/-2)+"px"});
	}, 100);*/
	/*dialog.on("click", function(event) {
		window.clearInterval(sizeCalculator);
	});*/
	$(".close-button").on("click", function(event) {
		$(".dialog").remove();
	});
}