var a = 1;
var b = 2;
var sliderHor = new sliderCore({

	unitSize: 300,
	sliderBox: $("#slider_left .slider_list"),
	sliderContainer: $("#slider_left .slider_list ul"),
	sliderItemSelect: "li",
	animCallBack: function(a,b){
		console.log(this);
		console.log(arguments);
	}

});

var sliderVer = new sliderCore({

	direction:"vertical",
	unitSize: 200,
	sliderBox: $("#slider_top .slider_list"),
	sliderContainer: $("#slider_top .slider_list ul"),
	sliderItemSelect: "li"

});

function verAnim() {

	var canAutoSlide = true;
	var outBox = $("#slider_top");
	outBox.find(".turnpage_handle span").click(function(){

		var i_num = $(this).html()/1;

		var i_currentNum = outBox.find(".turnpage_handle span.current").html()/1;

		if(i_num == i_currentNum)
		{
			return;
		}

		if(sliderVer.canAnimate)
		{
			outBox.find(".turnpage_handle span.current").removeClass("current");
			$(this).addClass("current");
		}
		
		// $("#slider_list").stop(false,true);
		if(i_num > i_currentNum)
		{
			sliderVer.slide("top", i_num - i_currentNum );
		}
		else
		{
			sliderVer.slide("bottom", i_currentNum - i_num );
		}

	});

	setInterval(function(){

		if(canAutoSlide)
		{
			if(sliderVer.canAnimate)
			{
				var current = outBox.find(".turnpage_handle span.current");
				outBox.find(".turnpage_handle span.current").removeClass("current");
				if(current.next().size() > 0)
				{
					current.next().addClass("current");
				}
				else
				{
					outBox.find(".turnpage_handle span:first").addClass("current");
				}
			}
			sliderVer.slide("top", 1);
		}

	}, 3000);

	outBox.find(".slider_out, .turnpage_handle").hover(function(){ canAutoSlide = false; },function(){ canAutoSlide = true; });	
}

function horAnim() {

	var canAutoSlide = true;
	var outBox = $("#slider_left");
	outBox.find(".turnpage_handle span").click(function(){

		var i_num = $(this).html()/1;

		var i_currentNum = outBox.find(".turnpage_handle span.current").html()/1;

		if(i_num == i_currentNum)
		{
			return;
		}

		if(sliderHor.canAnimate)
		{
			outBox.find(".turnpage_handle span.current").removeClass("current");
			$(this).addClass("current");
		}
		
		// $("#slider_list").stop(false,true);
		if(i_num > i_currentNum)
		{
			sliderHor.slide("left", i_num - i_currentNum );
		}
		else
		{
			sliderHor.slide("right", i_currentNum - i_num );
		}

	});

	setInterval(function(){

		if(canAutoSlide)
		{
			if(sliderHor.canAnimate)
			{
				var current = outBox.find(".turnpage_handle span.current");
				outBox.find(".turnpage_handle span.current").removeClass("current");
				if(current.next().size() > 0)
				{
					current.next().addClass("current");
				}
				else
				{
					outBox.find(".turnpage_handle span:first").addClass("current");
				}
			}
			sliderHor.slide("left", 1);
		}

	}, 3000);

	outBox.find(".slider_out, .turnpage_handle").hover(function(){ canAutoSlide = false; },function(){ canAutoSlide = true; });	
}



$(function(){

horAnim();
verAnim();

});

