$(function(){

	new mx_sliderArrow("slider_hor_one");
	new mx_sliderArrow("slider_hor_three", {count: 3, loop: "noloop"}, {viewCount: 3});
	new mx_sliderArrow("slider_ver_one", {direction: "vertical"});
	new mx_sliderArrow("slider_ver_three", {direction: "vertical", count: 3}, {viewCount: 3});

});