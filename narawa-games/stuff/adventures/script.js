function step(number) {
	var contents=stepContents[number];
	$(".half").html(contents);
	$("*").off();
	$("*").css("transition", "initial");
	$("#pageflip").css({"transform": "initial", "background-color": "white"});
	$(".choice").on("click", function(event) {
		$("#pageflip").transition({
			transform: "rotateY(-90deg)",
			backgroundColor: "silver"
		}, 250, "in", function() {
				$("#pageflip").transition({
					transform: "rotateY(-180deg)",
					backgroundColor: "white"
				}, 250, "out", function() {
						var next=$(event.target).attr("data-effect");
						step(next);
				});
		});
	});
}
$(document).ready(function() {
	step(startingStep);
});