$(function(){

	window.slider = new mx_sliderArrow("slider_hor", {count: 4, loop: "noloop"}, {viewCount: 4});

	$("#slider_hor .slider_item").click(function(){

		if($(this).hasClass("current"))
		{
			return;
		}

		$("#slider_hor .slider_item").removeClass("current");
		$(".big_shop_pic").html($(this).html());
		$(this).addClass("current");

	});

});