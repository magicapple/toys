$(function(){

	var animGroup = {
		sliderLeft : new mx_sliderBase("slider_left"),
		sliderRight : new mx_sliderBase("slider_right", {animDirection: "right"}),
		sliderUP : new mx_sliderBase("slider_up", {axial: "vertical", animDirection: "up"}),
		sliderDown : new mx_sliderBase("slider_down", {axial: "vertical", animDirection: "down"})
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