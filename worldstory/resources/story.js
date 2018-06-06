var page=0;
var bookID=null;
var queries=window.location.search;
function fetch(pageOffset) {
	page+=pageOffset;
	$.get("/fetch?page="+page+"&book="+bookID, function (data, state) {
		$(".reader").html(data);
		alert(data);
	});
}
$(document).ready(function () {
	bookID="book1"//queries.substring(6, queries.length);
	fetch(0);
});