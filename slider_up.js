(function($){

	var b_canAuto = true;
	var i_unitWidth = 200;
	var i_viewBlock = 1;
	var b_canAnimate = true;
	var i_silder_width = 0;
	var a_animat = [];
	var $_sliderBox = $("#slider_list");
	var s_sliderItem = "li";
	var $_silderContainer = $("#slider_list ul");

	var initPhotolist = function() {

		var i_li = $_silderContainer.find(s_sliderItem).size();
		i_silder_width = i_unitWidth * i_li;
		$_sliderBox.css("width", i_silder_width + "px");
		
	};

	var fixLeft = function(i_left) {
		return Math.round((i_left/i_unitWidth)) * i_unitWidth;
	};

	var analystSlider = function(direction, count) {

		if(!b_canAnimate)
		{
			a_animat.push([direction,count]);
			return;
		}

		var i_currentLeft = fixLeft($_sliderBox.position().top);
		var i_animateLeft;
		// alert(i_currentLeft + ":" + i_currentLeft/i_unitWidth);
		if(direction === "top") {
			if((i_silder_width + i_currentLeft - i_viewBlock*i_unitWidth - i_unitWidth*count) < 0 ) {
				$_silderContainer.append($_silderContainer.find(s_sliderItem).slice(0, count));
				$_sliderBox.css("top", (i_currentLeft + i_unitWidth*count) + "px");
				i_animateLeft = i_currentLeft;
			}
			else
			{
				i_animateLeft = i_currentLeft - count * i_unitWidth; 
			}
		} else {
			if((i_currentLeft + i_unitWidth*count) > 0 ) {
				$_silderContainer.prepend($_silderContainer.find(s_sliderItem).slice(0 - count));
				$_sliderBox.css("top", (i_currentLeft - i_unitWidth*count) + "px");
				i_animateLeft = i_currentLeft;
			}
			else
			{
				i_animateLeft = i_currentLeft + count*i_unitWidth;
			}
			
		}

		b_canAnimate = false;
		$_sliderBox.animate({top: i_animateLeft +'px'}, "slow","", function(){
			b_canAnimate = true;
			// if(a_animat.length > 0)
			// {
			// 	var a_temp = a_animat.shift();
			// 	analystSlider(a_temp[0], a_temp[1]);
			// }
		});


	};

	$(function(){

		initPhotolist();

		// $("#pre_30").click(function(){
		// 	analystSlider("left", 1);
		// });

		// $("#next_30").click(function(){
		// 	analystSlider("right", 1);
		// });

		$(".turnpage_handle span").click(function(){

			var i_num = $(this).html()/1;

			var i_currentNum = $(".turnpage_handle span.current").html()/1;

			if(i_num == i_currentNum)
			{
				return;
			}
			if(b_canAnimate)
			{
				$(".turnpage_handle span.current").removeClass("current");
				$(this).addClass("current");
			}
			
			// $("#slider_list").stop(false,true);
			if(i_num > i_currentNum)
			{
				analystSlider("top", i_num - i_currentNum );
			}
			else
			{
				analystSlider("bottom", i_currentNum - i_num );
			}

		});

		setInterval(function(){

			if(b_canAuto)
			{
				if(b_canAnimate)
				{
					var $_current = $(".turnpage_handle span.current");
					$(".turnpage_handle span.current").removeClass("current");
					if($_current.next().size() > 0)
					{
						$_current.next().addClass("current");
					}
					else
					{
						$(".turnpage_handle span:first").addClass("current");
					}
				}
				analystSlider("top", 1);
			}

		}, 3000);

		$("#slider_out, .turnpage_handle").hover(function(){ b_canAuto = false; },function(){ b_canAuto = true; })
	});

})(jQuery);

