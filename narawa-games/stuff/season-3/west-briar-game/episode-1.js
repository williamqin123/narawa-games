function episode1() {
	storyline = {
		"checkpoint-1" : "\
			<img src='drugs.png' class='small-image'>\
			<h2>Checkpoint 1</h2>\
			<p>\
				You have reached checkpoint 1!\
			</p>\
			<div class='choice-button shaded padded' onclick=\"goToPoint('1-2')\">Continue...</div>\
		",
		"1-2" : "\
			<p>\
				What's your name?\
			</p>\
			<p>\
				<input id='player-name'>\
			</p>\
			<div class='choice-button shaded padded' onclick=\"cache['name'] = $('#player-name').val(); goToPoint('1-3')\">Continue...</div>\
		",
		"1-3" : "\
			<p>\
				Welcome to West Briar, <span class='replace-with' data-replace='name'></span>!\
			</p>\
			<div class='choice-button shaded padded' onclick=\"goToPoint('1-4')\">Start your first day...</div>\
		"
	};
}