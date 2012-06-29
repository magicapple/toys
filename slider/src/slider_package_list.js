/**
 * todo 可自定义翻页html代码
 * todo 整理代码
 * <span class="current" data-value="1">1</span><span data-value="2">2</span><span data-value="3">3</span><span data-value="4">4</span><span data-value="5">5</span><span data-value="6">6</span>
 */

var mx_sliderBase = function(containerId, options, sliderOptions) {

	var options = options || {};
	var sliderOptions = sliderOptions || {};
	this.containerId = containerId;
	this.canAutoSlide = true;
	this.init(options, sliderOptions);
}

mx_sliderBase.prototype = {

	init: function(options, sliderOptions) {

		this.initParams(options);
		this.initSlider(sliderOptions);
		this.initTurnpage();
		this.initEvent();

	},

	initEvent: function() {

		var outBox = $("#"+ this.containerId);
		outBox.hover($.proxy(this.disableAutoSlide, this), $.proxy(this.enableAutoSlide, this));
		outBox.find(".turnpage_handle span").click($.proxy(this.turnpageSlide, this));

	},

	turnpageSlide: function(event) {

		var elm = event.target;
		var outBox = $("#"+ this.containerId);
		var i_num = $(elm).attr("data-value")/1;
		var i_currentNum = outBox.find(".turnpage_handle span.current").attr("data-value")/1;

		if(i_num === i_currentNum)
		{
			return;
		}

		if(this.slider.canAnimate)
		{
			outBox.find(".turnpage_handle span.current").removeClass("current");
			$(elm).addClass("current");
		}
		
		if(i_num > i_currentNum)
		{
			this.slider.slide(this.animDirection, i_num - i_currentNum);
		}
		else
		{
			var reverse  = {left: "right", right: "left", up: "down", down: "up"};
			this.slider.slide(reverse[this.animDirection], i_currentNum - i_num);
		}

	},

	initTurnpage: function() {

		var outBox = $("#"+ this.containerId);
		var htmlText = "";

		for(var i = 1; i <= this.slider.totalCount; i++)
		{
			
			if(i === 1)
			{
				htmlText = htmlText + '<span data-value="'+ i +'" class="current">'+ i +'</span>';
			}
			else
			{
				htmlText = htmlText + '<span data-value="'+ i +'">'+ i +'</span>';
			}

		}

		outBox.find(".turnpage_handle").html(htmlText);

	},

	disableAutoSlide: function() {

		this.canAutoSlide = false;

	},

	enableAutoSlide: function() {

		this.canAutoSlide = true;

	},

	initSlider: function(sliderOptions) {

		var options = {

			axial: this.axial,
			unitSize: this.unitSize,
			sliderBox: $("#"+ this.containerId +" .slider_list"),
			sliderContainer: $("#"+ this.containerId +" .slider_list ul"),
			sliderItemSelect: "li"

		};

		$.extend(options, sliderOptions);
		this.slider = new mx_sliderCore(options);

	},

	initParams: function(options) {

		this.axial = options.axial || "horizontal";
		this.animDirection = options.animDirection || "left";
		this.count = options.count || 1;
		this.intervalTime = options.intervalTime || 3000;
		this.unitSize = options.unitSize || this.getUnitSize();
		this.animInterval = null; 

	},

	getUnitSize: function() {

		var selectItem = $("#"+ this.containerId +" .slider_list ul li");

		if(this.axial === "horizontal")
		{
			return selectItem.width();
		}
		else
		{
			return selectItem.height();	
		}

	},

	anim: function() {

		if(this.canAutoSlide)
		{
			
			if(this.slider.canAnimate)
			{
				this.changTurnpageStyle();
			}

			this.slider.slide(this.animDirection, this.count);
		}

	},

	changTurnpageStyle: function() {

		var outBox = $("#"+ this.containerId);
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

	},

	start: function() {

		if(!this.animInterval)
		{
			this.animInterval = setInterval($.proxy(this.anim, this), this.intervalTime);
		}

	},

	stop: function() {

		clearInterval(this.animInterval);
		this.animInterval = null;
		
	}

}

