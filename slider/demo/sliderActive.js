$(function(){
	var dataList1 = [1,2,3,4,5];
	var dataList2 = [1,2,3,4,5,6,7,8,9];
	var dataList3 = [1,2,3,4,5,6,7,8,9];
	var dataList4 = [1,2,3,4,5,6,7,8,9,10,11,12];
	new mx_sliderArrow("slider_hor_one", {dataList: dataList1, unitSize: 150 });
	// new mx_sliderArrow("slider_hor_three", {count: 3, loop: "noloop", dataList: dataList2}, {viewCount: 3});
	new mx_sliderArrow("slider_hor_three", {count: 3, loop: "noloop", dataList: dataList2}, {viewCount: 3});
	new mx_sliderArrow("slider_ver_one", {axial: "vertical", dataList: dataList3, unitSize: 100});
	new mx_sliderArrow("slider_ver_three", {axial: "vertical", dataList: dataList4, count: 3}, {viewCount: 3});

});