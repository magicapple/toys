$(function(){

	new mx_sliderArrow("slider_hor_one");
	new mx_sliderArrow("slider_hor_three", {count: 3}, {viewCount: 3});
	new mx_sliderArrow("slider_ver_one", {direction: "vertical"});
	new mx_sliderArrow("slider_ver_three", {direction: "vertical", count: 3}, {viewCount: 3});

	// var animGroup = {
	// 	sliderLeft : new mx_sliderBase("slider_left"),
	// 	sliderRight : new mx_sliderBase("slider_right", {animDirection: "right"}),
	// 	sliderTop : new mx_sliderBase("slider_top", {direction: "vertical", animDirection: "top"}),
	// 	sliderDown : new mx_sliderBase("slider_down", {direction: "vertical", animDirection: "bottom"})
	// };

	// var animHandle = function(elm){

	// 	var value = $(elm).val();
	// 	if(elm.checked)
	// 	{
	// 		animGroup[value].start();
	// 	}
	// 	else
	// 	{
	// 		animGroup[value].stop();
	// 	}

	// }

	// $("label input").change(function(){

	// 	animHandle(this);

	// });

	// $("label input").each(function(){

	// 	animHandle(this);

	// });

});