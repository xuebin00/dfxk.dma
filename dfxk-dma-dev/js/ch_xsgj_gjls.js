$(function() {
	//  详情 弹窗
	var winH = $(window).innerHeight();
	$(".ch-gjls-list").on("click", ".dingdan a", function() {
		$("#popup").find("p").text($(this).attr("data-note"));
		$("body,html").height(winH - 60 + "px").css("overflow", "hidden");
		$(".popup").height(winH).fadeIn(200);
	})
	$(".ch_btn").on("click", function() {
		$(".popup").hide();
		$(".popup,body").height(winH).css("overflow", "auto");

	})
})