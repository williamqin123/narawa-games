$(document).ready(function() {
	var html = "\
		<div class=\"card\">\
			<h2 class=\"card-title\">\
				Recommended games\
			</h2>\
			<p>\
				We think you'd enjoy these games.\
				Narawa Games carefully picks game recommendations to make sure everyone has a good experience on our site.\
			</p>\
		</div>\
		<p class=\"spacer\">&nbsp;</p>\
		<section>\
			<div class=\"layout-row\">\
				<div class=\"column-layout\">\
					<a class=\"whole\" href=\"/season-2/tower-defense/updated.html\">\
						<div class=\"game\">\
							<img src=\"/categories/tdqr.jpg\" width=\"315\" height=\"265\">\
							<div class=\"description\">\
								<h3>\
								Robots Tower Defense\
								</h3>\
								<p>\
									If you&apos;ve played the original Tower Defense, it looks pretty boring. The graphics are absolutely terrible! So for those protesters out there: play the new and improved version! The robots are YELLOW, also very racy.\
								</p>\
							</div>\
						</div>\
					</a>\
				</div>\
				<div class=\"column-layout\">\
					<a class=\"whole\" href=\"/season-3/maze-runner/maze-runner-hero.html\">\
						<div class=\"game\">\
							<img src=\"/categories/maze-runner.jpg\" width=\"315\" height=\"265\">\
							<div class=\"description\">\
								<h3>\
								The Maze Runner\
								</h3>\
								<p>\
									Based off the movie and the book, this game resembles The Maze realistically.\
								<p>\
							</div>\
						</div>\
					</a>\
				</div>\
				<div class=\"column-layout\">\
					<a class=\"whole\" href=\"/season-3/lightsaber-fight/teenage-violence.html\">\
						<div class=\"game\">\
							<img src=\"/categories/lightsaber-fight.jpg\" width=\"315\" height=\"265\">\
							<div class=\"description\">\
								<h3>\
								Teenage Mutant Lightsaber Fights\
								</h3>\
								<p>\
									You are a 10-year-old named Maximilian Alkali Alfred, who battles a shrimpy pirate kid. Since this is a kids&apos; website, we&apos;ve removed the violence. So don&apos;t worry about arms being sliced off.\
								</p>\
							</div>\
						</div>\
					</a>\
				</div>\
			</div>\
		</section>\
		<nav class=\"dark\">\
			<a href=\"/categories/season3.html\">Return to Narawa Games!</a>\
		</nav>\
	";
	var offset = $("<div></div>");
	offset.css("height", "4rem");
	$("main").append(html);
	$("main").prepend(offset);
});