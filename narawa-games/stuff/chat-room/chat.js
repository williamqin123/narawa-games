var userInactiveTime=0;
var dataFetchTimeIncrement=1000;
var ajaxRequestLoop;
function refresh() {
	if (userInactiveTime>=15) {
		$(window).off();
		window.location.reload(false);
	}
	else {
		userInactiveTime=0;
	}
}
function calculateDialogSize() {
	var boxWidth=[650, "650px"];
	if (boxWidth[0]>=window.innerWidth) {
		boxWidth[1]="100%";
	}
	var boxHeight=[450, "450px"];
	if (boxHeight[0]>=window.innerHeight) {
		boxHeight[1]="100%";
	}
	$(".dialog").css({"width": boxWidth[1], "height": boxHeight[1]});
}
function calculateFormSize() {
	console.log($("#ajaxsend").outerWidth());
	$("#mainmessage").css("width", ($("#formpost").width()-44-$("#ajaxsend").outerWidth())+"px");
}
function adjust() {
	calculateDialogSize();
	calculateFormSize();
}
function scrollit() {
	window.scrollTo(0, $("body").height()-window.innerHeight);
}
function fetchData() {
	$.get("/ajax?server="+$("#idenserv").val(), function (data, state) {
		userInactiveTime++;
		var dataList=eval("["+data+"]").reverse();
		for (var dataCount=0; dataCount<dataList.length; dataCount++) {
			var sentData=dataList[dataCount];
			var ajaxDateTime=sentData.substring(sentData.indexOf("/*NarawaGamesInfoNameSerarator*/")+32, sentData.length);
			var ajaxData=sentData.substring(0, sentData.indexOf("/*NarawaGamesDataContentSerarator*/"));
			var comments=$(".comment:not(#nousername)");
			if ($(".comment[data-date=\""+ajaxDateTime+"\"]").length==0) {
				var newMessage=$("<table class='comment'><tr><td class='tag'><span class='msgname'>"+sentData.substring(sentData.indexOf("/*NarawaGamesDataContentSerarator*/")+35, sentData.indexOf("/*NarawaGamesInfoNameSerarator*/"))+"</span></td><td class='content'><div class='mcont'>"+ajaxData+"</div></td></tr></table>");
				newMessage.attr("data-date", ajaxDateTime);
				$("#messagearea").append(newMessage);
				if ($(window).scrollTop()+window.innerHeight>=$("body").height()-20) {
					scrollit();
				}
			}
		}
	});
}
function ajaxLoop() {
	fetchData();
	if (userInactiveTime>=15) {
		dataFetchTimeIncrement=2000;
	}
	ajaxRequestLoop=setTimeout(ajaxLoop, dataFetchTimeIncrement);
	if (userInactiveTime>=20) {
		clearTimeout(ajaxRequestLoop);
	}
}
$(document).ready(function () {
	adjust();
	$("#menu").on("click", function() {
		$("#room").css("display", "block");
	});
	var headerSize=$("header").outerHeight();
	var footerSize=$("#formpost").outerHeight();
	$("#messagearea").css("margin", (headerSize+8)+"px 0 "+(footerSize+8)+"px 0");
	scrollit();
	$("#posterfoot").on("submit", function () {
		preventDefault();
		return false;
	});
	$("#ajaxsend").on("click", function () {
		$.post("/post", {user: $("#usernamejq").val(), message: $("#mainmessage").val(), server: $("#idenserv").val()});
		$("#mainmessage").val("");
		$("#mainmessage").focus();
		fetchData();
	});
	$(window).on("mousemove", refresh);
	$(window).on("keydown", refresh);
	$(window).on("click", refresh);
	$(window).on("focus", refresh);
	$(window).on("touchstart", refresh);
	$(window).on("resize", adjust);
	$(window).on("blur", function () {
		userInactiveTime=15;
	});
	ajaxLoop();
});