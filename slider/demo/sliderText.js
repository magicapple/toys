$(function(){


	var animGroup = {

		sliderLeftText : new mx_sliderBase("slider_text_left"),
		sliderTopText : new mx_sliderBase("slider_text_top", {axial: "vertical", animDirection: "up"}),
		sliderMulTopText : new mx_sliderBase("slider_mul_text_top", {axial: "vertical", animDirection: "up" }, {viewCount: 4})
		
	};

	var animHandle = function(elm){

		var value = $(elm).val();
		if(elm.checked)
		{
			animGroup[value].start();
		}
		else
		{
			animGroup[value].stop();
		}

	}

	$("label input").change(function(){

		animHandle(this);

	});

	$("label input").each(function(){

		animHandle(this);

	});

});