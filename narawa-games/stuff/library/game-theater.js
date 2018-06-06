;$(document).ready(
	function() {
		$("main").prepend("\
			<a href=\"javascript:window.history.back();\" class=\"whole\">\
				<div class=\"game action\" id=\"narawa-games-back-button\">\
					<h3>&#9664; Return to Narawa Games</h3>\
				</div>\
			</a>\
		");
	}
);