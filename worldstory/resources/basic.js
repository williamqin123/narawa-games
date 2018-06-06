$(document).ready(function () {
	$(".button").on("click", function () {
		eval($(event.target).attr("action"));
	});
});