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
		this.initEvent();

	},

	initEvent: function() {

		var _this = this; 
		$("#"+ this.containerId).hover(function() {

			_this.canAutoSlide = false;

		}, 
		function() {

			_this.canAutoSlide = true;

		});

	},

	initSlider: function(sliderOptions) {

		var options = {

			direction: this.direction,
			unitSize: this.unitSize,
			sliderBox: $("#"+ this.containerId +" .slider_list"),
			sliderContainer: $("#"+ this.containerId +" .slider_list ul"),
			sliderItemSelect: "li"

		};

		$.extend(options, sliderOptions);

		this.slider = new mx_sliderCore(options);

	},

	initParams: function(options) {

		this.direction = options.direction || "horizontal";
		this.animDirection = options.animDirection || "left";
		this.count = options.count || 1;
		this.intervalTime = options.intervalTime || 3000;
		this.unitSize = options.unitSize || this.getUnitSize();
		this.animInterval = null; 

	},

	getUnitSize: function() {

		var selectItem = $("#"+ this.containerId +" .slider_list ul li");
		if(this.direction === "horizontal")
		{
			return selectItem.width();
		}
		else
		{
			return selectItem.height();	
		}

	},

	start: function() {

		if(!this.animInterval)
		{
			console.log("start");
			this.animInterval = setInterval($.proxy(this.anim, this), this.intervalTime);
		}

	},

	anim: function() {

		console.log("anim");
		if(this.canAutoSlide)
		{
			this.slider.slide(this.animDirection, this.count);
		}

	},

	stop: function() {

		clearInterval(this.animInterval);
		this.animInterval = null;
	}

}




$(function(){

	var sliderLeft = new mx_sliderBase("slider_left");
	sliderLeft.start();

	var sliderRight = new mx_sliderBase("slider_right", {animDirection: "right"});
	sliderRight.start();

	var sliderTop = new mx_sliderBase("slider_top", {direction: "vertical", animDirection: "top"});
	sliderTop.start();

	var sliderBottom = new mx_sliderBase("slider_bottom", {direction: "vertical", animDirection: "bottom"});
	sliderBottom.start();

	var sliderLeftText = new mx_sliderBase("slider_text_left");
	sliderLeftText.start();

	var sliderTopText = new mx_sliderBase("slider_text_top", {direction: "vertical", animDirection: "top"});
	sliderTopText.start();

	var sliderMulTopText = new mx_sliderBase("slider_mul_text_top", {direction: "vertical", animDirection: "top" }, {viewCount: 4});
	sliderMulTopText.start();

});

