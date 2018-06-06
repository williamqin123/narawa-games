function HTMLify(data) {
	var html = "";
	console.log(data);
	var parsedData = eval(data);
	for (var entity in parsedData) {
		html += "<div class='block box ajax-post' data-timestamp='" + entity.epochTime + "'>";
		if (entity.hasOwnProperty("topic")) {
			html += "<h3>Topic: " + entity.topic + "</h3>";
		}
		html += "<h4>Author: " + entity.author + "</h4>";
		html += "<h4>Timestamp: " + entity.dateTime + "</h4>";
		html += entity.content;
		html += "</div>";
	}
	$("#ajax").append(html);
}
function ajax() {
	$.get(
		"/fetch",
		{
			type: $("#ajax").attr("data-type"),
			limit: $(".ajax-post:last-child").attr("data-timestamp"),
			sort: $("#ajax").attr("data-sort")
		},
		function(data) {
			var html = HTMLify(data);
			$("#ajax").html();
		},
		"text"
	);
}
$(document).ready(function() {
	ajax();
});